import type { WorkingHours } from "../types/Clinic";

import dayjs from 'dayjs';

export const getFullDate = (date: string) => dayjs(date).format('dddd, DD MMMM YYYY - hh:mm A')

export const getAppointmentHour = (date: string) => dayjs(date).format('hh:mm A');

export const getAppointmentDate = (date: string) => dayjs(date).format('DD/MM/YYYY')

export const checkExpired = (date: string) => dayjs(date).isBefore(dayjs());

export const getAvailableHours = (workingHours: WorkingHours[], date: string) => {
    const selectedDate = dayjs(date);
    const today = dayjs()

    const isToday = selectedDate.isSame(today, "day");

    const day = (dayjs(date).day() + 1) % 7;

    const workingDay = workingHours.find((d) => d.day === day);
    if (!workingDay || !workingDay.isOpen || !workingDay.start || !workingDay.end) {
        return [];
    }

    const [startHours, startMinutes] = workingDay.start.split(":").map(Number);
    const [endHours, endMinutes] = workingDay.end.split(":").map(Number);
    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;

    let effectiveStart = startTime;

    if (isToday) {
        const currentTime = today.hour() * 60 + today.minute();
        const nextSlot = Math.ceil(currentTime / 30) * 30;
        effectiveStart = Math.max(startTime, nextSlot);
    }

    return generateSlots(effectiveStart, endTime);
}

const generateSlots = (startMinutes: number, endMinutes: number) => {
    const arr: string[] = [];

    for (let minutes = startMinutes; minutes + 30 <= endMinutes; minutes += 30) {
        arr.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
    }

    return arr;
};

export const getMinDate = () => {
    return dayjs().add(1, "day").format("YYYY-MM-DD");
};

export const isWorkingDay = (workingHours: WorkingHours[], date: string) => {
    const day = (dayjs(date).day() + 1) % 7;
    const workingDay = workingHours.find((d) => d.day === day);
    return workingDay && workingDay.isOpen
}