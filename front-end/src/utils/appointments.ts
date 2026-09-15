import { APPOINTMENT_DURATION } from "../data/constants";
import type { WorkingHours } from "../types/Clinic";

import dayjs from 'dayjs';

export const getFullDate = (date: string) => dayjs(date).format('dddd, DD MMMM YYYY - hh:mm A')

export const getAppointmentHour = (date: string) => dayjs(date).format('hh:mm A');

export const getAppointmentDate = (date: string) => dayjs(date).format('DD/MM/YYYY')

export const checkExpired = (date: string) => dayjs(date).isBefore(dayjs());

export const getAvailableHours = (workingHours: WorkingHours[], date: string) => {
    const selectedDate = new Date(date);
    const today = dayjs()

    const isToday =
        selectedDate.getFullYear() === today.year() &&
        selectedDate.getMonth() === today.month() &&
        selectedDate.getDate() === today.date();

    const day = (dayjs(date).day() + 1) % 7;

    const workingDay = workingHours.find((d) => d.day === day);
    if (!workingDay || !workingDay.isOpen || !workingDay.start || !workingDay.end) {
        return [];
    }

    const startHour = parseInt(workingDay.start.split(":")[0]);
    const endHour = parseInt(workingDay.end.split(":")[0]);

    let effectiveStart = startHour;

    if (isToday) {
        const currentHour = today.hour();
        effectiveStart = Math.max(startHour, currentHour + 1);
    }

    return generateSlots(effectiveStart, endHour);
}

const generateSlots = (startHour: number, endHour: number) => {
    const arr: string[] = [];

    for (let i = startHour; i < endHour; i += APPOINTMENT_DURATION) {
        const hours = Math.floor(i);
        const minutes = (i % 1) * 60;
        const hour = dayjs()
            .hour(hours)
            .minute(minutes)
            .format("HH:mm");
        arr.push(hour);
    }

    return arr;
};

export const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];;
};

export const isWorkingDay = (workingHours: WorkingHours[], date: string) => {
    const day = (dayjs(date).day() + 1) % 7;
    const workingDay = workingHours.find((d) => d.day === day);
    return workingDay && workingDay.isOpen
}