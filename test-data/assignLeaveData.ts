export const assignLeaveData = {
    employeeName: 'Peter Mac Anderson',
    employeeSearchText: 'Peter',
    leaveType: 'CAN - Vacation',
    entitlementDays: 10,
    comments: 'Automated leave assignment test'
} as const;

export function getUpcomingWeekday(daysAhead = 7): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + daysAhead);

    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}