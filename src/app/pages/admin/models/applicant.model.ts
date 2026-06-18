export interface Applicant {
    readonly name: string;
    readonly street: string;
    readonly street_number: string;
    readonly zipcode: string;
    readonly city: string;
    readonly phone: string;
    readonly email: string;
    readonly motivation: string;
    readonly kitchen: boolean;
    readonly bar: boolean;
    readonly catering_industry_experience: string;
    readonly other_activities: string;
    readonly for_how_long: string;
    readonly hours_per_week: number;
    readonly holliday_festival_plans: string;
}
