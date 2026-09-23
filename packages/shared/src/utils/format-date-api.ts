// export function formatDateApi(value: string) {
//     const date = new Date(value);

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return `${year}-${month}-${day}`;
// }

export function formatDateApi(value: string | Date) {
    const date = value instanceof Date
        ? value
        : new Date(value);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function dateStringToUtcDate(value: string): Date {
    const [year, month, day] = value
        .split("-")
        .map(Number);

    return new Date(
        Date.UTC(year, month - 1, day)
    );
}

export function monthYearToUtcDate(value: string): Date {
    const [year, month] = value
        .split("-")
        .map(Number);

    return new Date(
        Date.UTC(year, month - 1, 1)
    );
}

export function addMonthsToDate(
    date: Date,
    months: number
): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() + months,
            1
        )
    );
}



export function formatDateApiName(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}
