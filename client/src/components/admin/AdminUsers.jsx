import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'
import { 
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

export default function AdminUsers() {
  const { appUser } = useAuth()
  const queryClient = useQueryClient()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'view', 'edit', 'create'

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminService.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully')
      queryClient.invalidateQueries(['admin', 'users'])
    },
    onError: () => {
      toast.error('Failed to delete user')
    }
  })

  // Update user mutation  
  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...data }) => adminService.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully')
      queryClient.invalidateQueries(['admin', 'users'])
      setShowModal(false)
      setSelectedUser(null)
    },
    onError: () => {
      toast.error('Failed to update user')
    }
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      toast.success('User created successfully')
      queryClient.invalidateQueries(['admin', 'users'])
      setShowModal(false)
      setSelectedUser(null)
    },
    onError: () => {
      toast.error('Failed to create user')
    }
  })

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'free-agents' && user.isFreeAgent) ||
        (statusFilter === 'active' && user.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleDeleteUser = (user) => {
    if (user.id === appUser.id) {
      toast.error('Cannot delete your own account')
      return
    }
    
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      deleteUserMutation.mutate(user.id)
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalMode('view')
    setShowModal(true)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setModalMode('create')
    setShowModal(true)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'COACH': return 'bg-blue-100 text-blue-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="COACH">Coach</option>
              <option value="PLAYER">Player</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="free-agents">Free Agents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No users found matching your criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt=""
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCircleIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {user.isFreeAgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                              Free Agent
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? format(parseISO(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <UserCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit User"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          {user.id !== appUser.id && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <div className="text-sm text-gray-500">Admins</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'PLAYER').length}
            </div>
            <div className="text-sm text-gray-500">Players</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.isFreeAgent).length}
            </div>
            <div className="text-sm text-gray-500">Free Agents</div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          onSubmit={(data) => {
            if (modalMode === 'create') {
              createUserMutation.mutate(data)
            } else if (modalMode === 'edit') {
              updateUserMutation.mutate({ id: selectedUser.id, ...data })
            }
          }}
          isLoading={updateUserMutation.isPending || createUserMutation.isPending}
        />
      )}
    </div>
  )
}

// User Modal Component
function UserModal({ user, mode, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'PLAYER',
    isFreeAgent: user?.isFreeAgent || false,
    isActive: user?.isActive !== false,
    phone: user?.phone || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactPhone: user?.emergencyContactPhone || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Create User' : 
               mode === 'edit' ? 'Edit User' : 'User Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                readOnly={isReadOnly}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                readOnly={isReadOnly}
                className="form-input"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              readOnly={isReadOnly}
              className="form-input"
              required
            />

            <input
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              readOnly={isReadOnly}
              className="form-input"
            />

            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={isReadOnly}
              className="form-input"
            >
              <option value="PLAYER">Player</option>
              <option value="COACH">Coach</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Emergency Contact Name"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                readOnly={isReadOnly}
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Emergency Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                readOnly={isReadOnly}
                className="form-input"
              />
            </div>

            {!isReadOnly && (
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFreeAgent}
                    onChange={(e) => setFormData({ ...formData, isFreeAgent: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-900">Free Agent</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-900">Active</span>
                </label>
              </div>
            )}

            {!isReadOnly && (
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="btn-outline">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? <LoadingSpinner size="sm" color="white" /> : 
                   mode === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}