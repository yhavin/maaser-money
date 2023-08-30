import { useRecurringDay } from "./useRecurringDay.js"
import { useRecurringMonth } from "./useRecurringMonth.js"
import { useRecurringWeek } from "./useRecurringWeek.js"


export const useCreateRecurringItems = async (schedule) => {
  switch (schedule.frequency) {
    case "day":
      await useRecurringDay(schedule)
      break
    case "week":
      await useRecurringWeek(schedule, 1)
      break
    case "twoWeeks":
      await useRecurringWeek(schedule, 2)
      break
    case "month":
      await useRecurringMonth(schedule)
  }
}