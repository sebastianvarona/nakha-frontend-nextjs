import { formatRelative } from 'date-fns'
import { enUS } from 'date-fns/locale'

export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`
}

export const formatLocaleRelative = (dateString: string): string => {
  const date = new Date(dateString)
  const relativeDate = formatRelative(date, new Date(), { locale: enUS })
  const firstWord = relativeDate.split(' ')[0]
  return (
    firstWord.charAt(0).toUpperCase() + firstWord.slice(1) + relativeDate.slice(firstWord.length)
  )
}
