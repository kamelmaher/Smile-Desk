import type { WorkingHours } from "../types/Clinic";

import dayjs from 'dayjs';

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export function formatWorkingHours(hours: WorkingHours[]) {
    if (!hours || !hours.length) return "غير محدد";

    const openDays = hours
        .filter((d) => d.isOpen)
        .sort((a, b) => a.day - b.day);

    if (!openDays.length) return "مغلق";

    const formatTime = (t: string) => {
        return dayjs(`2026-01-01T${t}`).format('h:mm A')
            .replace('AM', 'صباحاً')
            .replace('PM', 'مساءً');
    };

    const results: string[] = [];
    let i = 0;

    while (i < openDays.length) {
        const startIdx = i;

        while (
            i + 1 < openDays.length &&
            openDays[i + 1].day === openDays[i].day + 1 &&
            openDays[i + 1].start === openDays[startIdx].start &&
            openDays[i + 1].end === openDays[startIdx].end
        ) {
            i++;
        }

        const startDay = openDays[startIdx];
        const endDay = openDays[i];

        const dayRange = startIdx === i
            ? DAYS[startDay.day]
            : `${DAYS[startDay.day]} - ${DAYS[endDay.day]}`;

        results.push(`${dayRange}: ${formatTime(startDay.start)} - ${formatTime(startDay.end)}`);

        i++;
    }

    return results.join(' | ');
}