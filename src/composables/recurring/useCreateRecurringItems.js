import { useRecurringDay } from "./useRecurringDay.js"
import { useRecurringMonth } from "./useRecurringMonth.js"


export const useCreateRecurringItems = async (schedule) => {
  switch (schedule.frequency) {
    case "day":
      await useRecurringDay(schedule)
      break
    case "week":
      await useRecurringWeek(schedule)
      break
    case "twoWeeks":
      await useRecurringTwoWeeks(schedule)
      break
    case "month":
      await useRecurringMonth(schedule)
  }
}