import { Survey, Question , User} from "./interfaces"
import { db } from "../database/db"
/* 
SQL Query for list
*/
const sql_survey_list = ()  :string =>{
    return `
    SELECT
        id, 
        title, 
        week_num, 
        type, 
        to_char(created_on, 'YYYY-MM-DD') as created 
    FROM surveys;
    `
}

const sql_survey_retrieve = (sid : number)  :string =>{
    return `
    select
        s.id,
        s.title,
        s.week_num,
        s.type,
        to_char(s.created_on, 'YYYY-MM-DD') as created,
        string_to_array(max(answers), ',') as answers,
        string_to_array(max(scores), ',') as scores,
        JSON_AGG(
                JSON_BUILD_OBJECT(
                        'id', sq.id,
                        'body', body,
                        'is_reverse', is_reverse,
                        'type', sq.type
                    )
            ) as questions
    from surveys s
    inner join surveys_questions sq on s.id = sq.survey_id
    inner join survey_answers sa on s.id = sa.survey_id
    where s.id = ${sid}
    group by s.id;
    `
}

const sql_survey_insert = (survey : Survey)  :string =>{
    return `
    insert into surveys
    (title, week_num, type)
    values 
    (${db.escapeLiteral(survey.title)}, ${db.escapeLiteral(survey.week_num)}, ${db.escapeLiteral(survey.type)})
    RETURNING id
    `
}

const sql_survey_answer_insert = (survey : Survey)  :string =>{
    return `
    insert into survey_answers
    (survey_id, answers, scores)
    values 
    (${survey.id},${db.escapeLiteral(survey.answers.join(','))}, ${db.escapeLiteral(survey.scores.join(','))})
    `
}

const sql_survey_question_insert = (survey : Survey)  :string =>{
    let ret  = `
    insert into surveys_questions
    (body, is_reverse, survey_id, type)
    values 
    `;
    const questions = survey.questions.map((value, index, array)=>{
        return `(${db.escapeLiteral(value.body)}, ${value.is_reverse}, ${survey.id}, ${db.escapeLiteral(value.type)})`;
    })
    
    ret += questions.join(', ');
    return ret
}

const sql_survey_delete = (sid : number)  :string =>{
    return `
    delete
    from surveys
    where id = ${sid};
    `
}

const sql_user_login = (user : User)  :string =>{
    return `
    select * from users 
    where 
    username = ${db.escapeLiteral(user.username)} and 
    password = ${db.escapeLiteral(user.password)};
    `
}

export { 
    sql_survey_list,
    sql_survey_retrieve,
    sql_survey_insert,
    sql_survey_question_insert,
    sql_survey_answer_insert,
    sql_survey_delete,
    sql_user_login
};
