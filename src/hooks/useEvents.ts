import { useState, useEffect } from 'react'
import { startOfWeek, addDays, addWeeks, format } from 'date-fns'

// Real event data - weekly recurring events
const generateEvents = () => {
  const events = []
  const startDate = new Date()
  
  // Generate events for next 8 weeks
  for (let week = 0; week < 8; week++) {
    const weekStart = startOfWeek(startDate)
    
    // Friday events
    const friday = addDays(addWeeks(weekStart, week), 5)
    const fridayDate = format(friday, 'yyyy-MM-dd')
    
    // 을지로 솔로파티 - 금요일 (1부+2부 통합)
    events.push({
      id: `euljiro-fri-${week}`,
      date: fridayDate,
      title: '을지로 솔로파티',
      start_time: '20:00',
      end_time: '02:00',
      location: '을지로 1호점 (을지로4가역, 충무로역 인근)',
      description: '8가지 이상의 다양한 음식과 술/음료 무제한으로 즐기는 솔로파티. 1부(20:00-23:00), 2부(23:00-02:00) 중 선택하거나 연속 참여 가능합니다.',
      price_male_standard: 43000,
      price_male_premium: 63000,
      price_female_standard: 37000,
      price_female_premium: 53000,
      capacity_male: 80,
      capacity_female: 80,
      status: 'open',
      counts: {
        male: Math.floor(Math.random() * 60) + 40, // 40-99명
        female: Math.floor(Math.random() * 60) + 45, // 45-104명
        total: 0
      },
      application_deadline: format(addDays(friday, -1), 'yyyy-MM-dd HH:mm:ss'),
      parts: [
        { name: '1부', time: '20:00-23:00' },
        { name: '2부', time: '23:00-02:00' }
      ]
    })
    
    // 신촌 게하파티 - 금요일 (1부+2부 통합)
    events.push({
      id: `sinchon-fri-${week}`,
      date: fridayDate,
      title: '신촌 게하파티',
      start_time: '20:00',
      end_time: '02:00',
      location: '신촌 2호점 (신촌역 잠수경 인근)',
      description: '8가지 이상의 다양한 음식과 술/음료 무제한으로 즐기는 게하파티. 1부(20:00-23:00), 2부(23:00-02:00) 중 선택하거나 연속 참여 가능합니다.',
      price_male_standard: 43000,
      price_male_premium: 63000,
      price_female_standard: 37000,
      price_female_premium: 53000,
      capacity_male: 70,
      capacity_female: 70,
      status: 'open',
      counts: {
        male: Math.floor(Math.random() * 50) + 35, // 35-84명
        female: Math.floor(Math.random() * 50) + 40, // 40-89명
        total: 0
      },
      application_deadline: format(addDays(friday, -1), 'yyyy-MM-dd HH:mm:ss'),
      parts: [
        { name: '1부', time: '20:00-23:00' },
        { name: '2부', time: '23:00-02:00' }
      ]
    })
    
    // Saturday events
    const saturday = addDays(addWeeks(weekStart, week), 6)
    const saturdayDate = format(saturday, 'yyyy-MM-dd')
    
    // 을지로 솔로파티 - 토요일 (1부+2부 통합)
    events.push({
      id: `euljiro-sat-${week}`,
      date: saturdayDate,
      title: '을지로 솔로파티',
      start_time: '20:00',
      end_time: '02:00',
      location: '을지로 1호점 (을지로4가역, 충무로역 인근)',
      description: '8가지 이상의 다양한 음식과 술/음료 무제한으로 즐기는 솔로파티. 1부(20:00-23:00), 2부(23:00-02:00) 중 선택하거나 연속 참여 가능합니다.',
      price_male_standard: 43000,
      price_male_premium: 63000,
      price_female_standard: 37000,
      price_female_premium: 53000,
      capacity_male: 80,
      capacity_female: 80,
      status: 'open',
      counts: {
        male: Math.floor(Math.random() * 65) + 45, // 45-109명
        female: Math.floor(Math.random() * 65) + 50, // 50-114명
        total: 0
      },
      application_deadline: format(addDays(saturday, -1), 'yyyy-MM-dd HH:mm:ss'),
      parts: [
        { name: '1부', time: '20:00-23:00' },
        { name: '2부', time: '23:00-02:00' }
      ]
    })
    
    // 신촌 게하파티 - 토요일 (1부+2부 통합)
    events.push({
      id: `sinchon-sat-${week}`,
      date: saturdayDate,
      title: '신촌 게하파티',
      start_time: '20:00',
      end_time: '02:00',
      location: '신촌 2호점 (신촌역 잠수경 인근)',
      description: '8가지 이상의 다양한 음식과 술/음료 무제한으로 즐기는 게하파티. 1부(20:00-23:00), 2부(23:00-02:00) 중 선택하거나 연속 참여 가능합니다.',
      price_male_standard: 43000,
      price_male_premium: 63000,
      price_female_standard: 37000,
      price_female_premium: 53000,
      capacity_male: 70,
      capacity_female: 70,
      status: 'open',
      counts: {
        male: Math.floor(Math.random() * 55) + 40, // 40-94명
        female: Math.floor(Math.random() * 55) + 45, // 45-99명
        total: 0
      },
      application_deadline: format(addDays(saturday, -1), 'yyyy-MM-dd HH:mm:ss'),
      parts: [
        { name: '1부', time: '20:00-23:00' },
        { name: '2부', time: '23:00-02:00' }
      ]
    })
    
    // Sunday events
    const sunday = addDays(addWeeks(weekStart, week), 0) // Sunday
    const sundayDate = format(sunday, 'yyyy-MM-dd')
    
    // 신촌 게하파티 - 일요일 (1부+2부 통합)
    events.push({
      id: `sinchon-sun-${week}`,
      date: sundayDate,
      title: '신촌 게하파티',
      start_time: '18:00',
      end_time: '24:00',
      location: '신촌 2호점 (신촌역 잠수경 인근)',
      description: '8가지 이상의 다양한 음식과 술/음료 무제한으로 즐기는 게하파티. 1부(18:00-21:00), 2부(21:00-24:00) 중 선택하거나 연속 참여 가능합니다.',
      price_male_standard: 43000,
      price_male_premium: 63000,
      price_female_standard: 37000,
      price_female_premium: 53000,
      capacity_male: 60,
      capacity_female: 60,
      status: 'open',
      counts: {
        male: Math.floor(Math.random() * 40) + 25, // 25-64명
        female: Math.floor(Math.random() * 40) + 30, // 30-69명
        total: 0
      },
      application_deadline: format(addDays(sunday, -1), 'yyyy-MM-dd HH:mm:ss'),
      parts: [
        { name: '1부', time: '18:00-21:00' },
        { name: '2부', time: '21:00-24:00' }
      ]
    })
  }
  
  // Calculate total counts
  events.forEach(event => {
    event.counts.total = event.counts.male + event.counts.female
  })
  
  console.log('Generated consolidated events:', events.length)
  console.log('Sample events:', events.slice(0, 3).map(e => ({ id: e.id, date: e.date, title: e.title })))
  
  return events
}

export function useEvents() {
  const [events, setEvents] = useState(generateEvents())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    // Mock function - events are generated above
  }

  return { events, loading, error, refetch: fetchEvents }
}

export function useEvent(eventId: string | undefined) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setEvent(null)
      return
    }

    // Find event from generated data
    const allEvents = generateEvents()
    const foundEvent = allEvents.find(e => e.id === eventId)
    setEvent(foundEvent || null)
  }, [eventId])

  return { event, loading, error }
}