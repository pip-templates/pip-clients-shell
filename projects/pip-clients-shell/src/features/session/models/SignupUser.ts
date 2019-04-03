export class SignupUser {
    public login?: string;
    public email?: string;
    public name?: string;
    public position?: string;
    public company?: string;
    public phone?: string;
    public password?: string;
    public avatar?: string;

    /* User preferences */
    public about?: string;
    public time_zone?: string;
    public language?: string;
    public theme?: string;

    public remember?: boolean;
}
