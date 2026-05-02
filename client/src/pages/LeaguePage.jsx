import { 
  TrophyIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function LeaguePage() {
  const features = [
    {
      icon: CalendarIcon,
      title: '5-Week Season',
      description: 'Regular season fits summer schedules.'
    },
    {
      icon: TrophyIcon,
      title: 'All Teams Make Playoffs',
      description: 'Single elimination playoff format.'
    },
    {
      icon: StarIcon,
      title: 'Target Score Finish',
      description: 'Final 3 minutes use special rules.'
    },
    {
      icon: CurrencyDollarIcon,
      title: '$1,000 Prize',
      description: 'Championship team takes home the prize.'
    },
    {
      icon: UserGroupIcon,
      title: 'Plum Borough League',
      description: 'Local community basketball since 2024.'
    },
    {
      icon: ClockIcon,
      title: 'Two Seasons Complete',
      description: 'Season 3 starts Summer 2026.'
    }
  ];

  const rules = [
    {
      category: 'Regular Season',
      items: [
        '5 weeks',
        'Seeding for playoffs'
      ]
    },
    {
      category: 'Playoffs',
      items: [
        'All teams qualify',
        'Single elimination'
      ]
    },
    {
      category: 'Target Score',
      items: [
        'Clock stops with 3 minutes remaining to begin target score final',
        'Leading score + 8 = target',
        'First to target wins'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-800 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Cam Moss League
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-purple-100">
              Bringing Community Together Through Basketball
            </p>
            <p className="text-lg mb-8 text-purple-200">
              Est. 2024 • Season 2 Complete • Season 3 Starts Next Summer
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold">
                🏘️ Community League
              </span>
              <span className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                🏀 Local Basketball
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            League Format
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <feature.icon className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Target Score Explanation */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <FireIcon className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Target Score Rules
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                    <p className="text-gray-700"><strong>At 3:00 remaining:</strong> Game clock turns off, shot clock stays active</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                    <p className="text-gray-700"><strong>Target Score Set:</strong> Leading team's score + 8 points</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                    <p className="text-gray-700"><strong>Winner:</strong> First team to reach the target score wins immediately!</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                    <p className="text-gray-700"><strong>No Free Throws:</strong> Non-shooting fouls don't result in free throws</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-8 rounded-lg">
                <h4 className="text-xl font-bold mb-4">Example Scenario</h4>
                <div className="space-y-3">
                  <p>Game Score: Lakers 78, Warriors 75</p>
                  <p>3:00 remaining → Clock turns off</p>
                  <p>Target Score: 78 + 8 = <span className="text-yellow-300 font-bold text-2xl">86</span></p>
                  <p>First team to score 86 points wins!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* League History */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <TrophyIcon className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Champions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 2024 First Season */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-lg shadow-lg border-2 border-yellow-200">
              <div className="text-center">
                <div className="bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1st
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">2024 Season</h3>
                <p className="text-lg text-gray-600 mb-4">Inaugural Champions</p>
                <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg inline-block font-bold text-xl">
                  🏆 Yinzers
                </div>
              </div>
            </div>

            {/* 2025 Second Season */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg shadow-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2nd
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">2025 Season</h3>
                <p className="text-lg text-gray-600 mb-4">Defending Champions</p>
                <div className="bg-purple-600 text-white px-6 py-3 rounded-lg inline-block font-bold text-xl">
                  🏆 Plum's Finest
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Next Season</h4>
              <p className="text-lg text-gray-700">
                <span className="font-bold text-purple-600">Season 3</span> begins Summer 2026.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Format */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <ChartBarIcon className="h-16 w-16 text-purple-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rules.map((ruleCategory, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{ruleCategory.category}</h3>
              <ul className="space-y-3">
                {ruleCategory.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Community Recognition */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <TrophyIcon className="h-20 w-20 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Championship Prize
            </h2>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
              <ul className="space-y-2 text-left text-lg">
                <li>🏆 Championship trophy</li>
                <li>💰 $1,000 cash prize</li>
                <li>🏅 Bragging rights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Community Participation */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the League
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Plum Borough community basketball. All skill levels welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register-team"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
            >
              Register Team
            </Link>
            <Link 
              to="/teams"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
            >
              All Teams
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}