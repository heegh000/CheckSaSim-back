interface Question{
    id: number;
    body: string;
    is_reverse: boolean;
    type:string;
}


interface Survey{
    id: number;
    title: string;
    week_num:string;
    type:string;
    answers:string[];
    scores:number[];
    created: string;
    questions:Question[];
}

interface User{
    username:string;
    password:string;
}


export {
    Survey,
    Question,
    User
}
