import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ComplaintForm from './ComplaintForm';
import toast from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast');

// Mock fetch
global.fetch = vi.fn();

describe('ComplaintForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, status: 'PENDING' })
    });
  });

  it('renders form with all required fields', () => {
    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText('File a Complaint')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number (Optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject *')).toBeInTheDocument();
    expect(screen.getByLabelText('Detailed Description *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Complaint' })).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByRole('button', { name: 'Submit Complaint' });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent form submission
    expect(fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Phone Number (Optional)'), {
      target: { value: '555-0123' }
    });
    fireEvent.change(screen.getByLabelText('Subject *'), {
      target: { value: 'Referee Issue' }
    });
    fireEvent.change(screen.getByLabelText('Detailed Description *'), {
      target: { value: 'There was an issue with the referee during last night\'s game.' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Submit Complaint' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/public/forms/submit/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submitterName: 'John Doe',
          submitterEmail: 'john@example.com',
          submitterPhone: '555-0123',
          subject: 'Referee Issue',
          message: 'There was an issue with the referee during last night\'s game.',
          seasonId: null
        })
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Complaint submitted successfully. We will review it and get back to you.'
    );
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles API error gracefully', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Validation error' })
    });

    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Subject *'), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText('Detailed Description *'), {
      target: { value: 'Test message' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Complaint' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Validation error');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('handles network error gracefully', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    // Fill out form with minimum required data
    fireEvent.change(screen.getByLabelText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Subject *'), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText('Detailed Description *'), {
      target: { value: 'Test message' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Complaint' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error submitting complaint. Please try again.');
    });
  });

  it('disables submit button while submitting', async () => {
    // Mock a slow response
    fetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ id: 1 })
    }), 100)));

    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Subject *'), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText('Detailed Description *'), {
      target: { value: 'Test message' }
    });

    const submitButton = screen.getByRole('button', { name: 'Submit Complaint' });
    fireEvent.click(submitButton);

    // Button should show submitting state
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit Complaint' })).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText('Your Name *');
    const emailInput = screen.getByLabelText('Email Address *');
    const subjectInput = screen.getByLabelText('Subject *');
    const messageInput = screen.getByLabelText('Detailed Description *');

    // Fill out form
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Submit Complaint' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    // Form should be reset
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(subjectInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  it('displays helpful information about the complaint process', () => {
    render(<ComplaintForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText('Please Note:')).toBeInTheDocument();
    expect(screen.getByText(/All complaints will be reviewed by league administrators/)).toBeInTheDocument();
    expect(screen.getByText(/We aim to respond within 48 hours/)).toBeInTheDocument();
  });
});