export function getAge(
    dateOfBirth: Date | string | null | undefined,
    asOf: Date = new Date()
): number | null {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
        return null;
    }

    let age = asOf.getFullYear() - birthDate.getFullYear();

    const hasHadBirthday =
        asOf.getMonth() > birthDate.getMonth() ||
        (
            asOf.getMonth() === birthDate.getMonth() &&
            asOf.getDate() >= birthDate.getDate()
        );

    if (!hasHadBirthday) {
        age--;
    }

    return age;
}