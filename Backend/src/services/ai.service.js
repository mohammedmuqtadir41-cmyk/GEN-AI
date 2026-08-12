const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe("The match score between the candidate and the job description"),
  technicalQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the questions",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question ,What points to cover, What approach to take etc.",
          ),
      }),
    )
    .describe(
      "The technical questions that can be asked in the interview along with the intention of the interviewer and how to answer them",
    ),
  behavioralQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the questions",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question ,What points to cover, What approach to take etc.",
          ),
      }),
    )
    .describe(
      "The behavioral questions that can be asked in the interview along with the intention of the interviewer and how to answer them",
    ),
  skillsGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]),
      }),
    )
    .describe(
      "The skills that the candidate is lacking along with the severity of the skill gap",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day of the preparation plan"),
        focus: z
          .string()
          .describe("The focus of the preparation plan for that day"),
        tasks: z
          .array(z.string())
          .describe(
            "The tasks that the candidate should do on that day to improve the skill gap",
          ),
      }),
    )
    .describe(
      "The actions that the candidate should take to improve the skill gap along with the resources that the candidate can use to improve the skill gap",
    ),
  // technicalQuestions: z.array(technicalQuestionSchema).length(5),

  // behavioralQuestions: z.array(behavioralQuestionSchema).length(5),

  // skillGaps: z.array(skillGapSchema),

  // preparationPlan: z.array(preparationDaySchema).length(7),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a Senior Technical Interviewer.

Analyze the candidate based only on the provided Resume, Self Description, and Job Description.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate an interview report with:

- Match score (0-100)
- 5 technical interview questions
- 5 behavioral interview questions
- Skill gaps with severity (low, medium, high)
- 7-day preparation plan

Rules:

- Match the provided JSON schema exactly.
- Do not create extra fields.
- Do not rename fields.
- Every technical question must be an object with:
  - question
  - intention
  - answer
- Every behavioral question must be an object with:
  - question
  - intention
  - answer
- Every skill gap must be an object with:
  - skill
  - severity
- Every preparation plan item must be an object with:
  - day
  - focus
  - tasks
- Base your analysis only on the provided information.
- Do not invent experience or skills.
- Return ONLY a JSON object matching EXACTLY this structure.

{
  "matchScore": 75,
  "technicalQuestion": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "behavioralQuestion":[
    {
      "question":"...",
      "intention":"...",
      "answer":"..."
    }
  ],
  "skillsGaps":[
    {
      "skill":"...",
      "severity":"high"
    }
  ],
  "preparationPlan":[
    {
      "day":1,
      "focus":"...",
      "tasks":["...","..."]
    }
  ]
}

Do not return markdown.
Do not flatten arrays.
Do not omit properties.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(response.text);
  const report = interviewReportSchema.parse(JSON.parse(response.text));
  console.dir(report, { depth: null });
  return report;
}

const openingQuestionSchema = z.object({
  question: z
    .string()
    .describe(
      "The Opening interview question to ask to the candidate.",
    ),
});

async function generateOpeningMockQuestion({ interviewReport }) {
  const prompt = `You are a Senior Technical Interviewer about to start a live mock interview.

  Job Description: 
  ${interviewReport.jobDescription}

  Candidate Background: 
  ${interviewReport.resume || interviewReport.selfDescription || "Not provided"}

  known Skill Gaps:
  ${JSON.stringify(interviewReport.skillsGaps || [])}

  Task: 
  Ask one opening interview Question to the candidate to start the mock interview

  The question should: 
  -Be relevant to the job description
  - Be relevant to the candidate's background.
  - Feel like a real interview question.
  - Start the interview naturally.
  - Not ask multiple questions at once.

  Return ONLY a JSON object matching this structure:

{
  "question": "..."
}

`;
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(openingQuestionSchema),
    },
  });

  const { question } = openingQuestionSchema.parse(JSON.parse(response.text));

  return question;
}

const answerEvaluationSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(10)
    .describe("Score the candidate's answer from 0 to 10"),
  feedback: z
    .string()
    .describe("Constructive feedback about the candidate's answer"),
  strengths: z
    .array(z.string())
    .describe("Spcific things that candidate did well"),
  improvements: z
    .array(z.string())
    .describe("Specific things the candidate need to improve"),
});

async function evaluateInterviewAnswer({ question, answer, interviewReport }) {
  const prompt = `
  You are a Senior Technical Interviewer evaluating a candidate's answer.

  Job Description: 
  ${interviewReport.jobDescription}

  Candidate Background: 
  ${interviewReport.resume || interviewReport.selfDescription || "Not provided"}

  Interview Question: 
  ${question}

  Candidate's Answer:
  ${answer}

  Evaluate the candidate's answer.

  Consider:
- Technical correctness
- Relevance to the question
- Clarity of explanation
- Depth of understanding
- Practical reasoning
- Whether the answer is supported by the candidate's background

Give a fair score from 0 to 10.

Do not penalize the candidate simply because the answer is short.
Do not invent information about the candidate.

Return only a JSON object matching this structure
{
"score": 8,
"feedback":"....",
"strengths":["...","..."],
"improvements": ["...","..."]
}

Do not return a markdown

  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(answerEvaluationSchema),
    },
  });

  const evaluation = answerEvaluationSchema.parse(JSON.parse(response.text));

  return evaluation;
}

const nextQuestionSchema = z.object({
  question: z.string().describe("The interview question to ask to the candidate. Must not repeat any question already asked in this session.")
})

async function generateNextQuestion({interviewReport, questionsAsked}){
  const prompt = `You are a Senior Technical Interviewer conducting a live mock interview.

Job Description:
${interviewReport.jobDescription}

Candidate Background:
${interviewReport.resume || interviewReport.selfDescription || "Not provided"}

Known Skill Gaps:
${JSON.stringify(interviewReport.skillsGaps || [])}

Questions Already Asked:
${JSON.stringify(
  questionsAsked.map((item) => ({
    question: item.question,
    answer: item.answer,
    feedback: item.feedback,
  }))
)}

Task:
Generate the next interview question for the candidate.

Use the candidate's previous answers and feedback to decide what should be asked next.

The next question should:

- Be relevant to the job description.
- Be appropriate for the candidate's background.
- Not repeat or closely duplicate any previously asked question.
- Progress the interview naturally.
- Explore a different relevant skill, concept, experience, or weakness.
- Use previous answers and feedback to identify areas that need deeper evaluation when appropriate.
- If the previous answer reveals a weak area, ask a follow-up question only when deeper evaluation of that same topic is useful.
- Otherwise move naturally to another relevant topic.
- Ask only one question.
- Feel like a real interviewer continuing the same interview.

Return ONLY a JSON object matching this structure:

{
  "question": "..."
}

Do not return markdown.
Do not add extra fields.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType:  "application/json",
      responseJsonSchema: zodToJsonSchema(nextQuestionSchema),
    },
  });

  const {question } = nextQuestionSchema.parse(JSON.parse(response.text));

  return question;
}


module.exports = {
  generateInterviewReport,
  generateOpeningMockQuestion,
  evaluateInterviewAnswer,
  generateNextQuestion,
};
