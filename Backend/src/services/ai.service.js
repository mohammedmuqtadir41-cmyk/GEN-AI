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

async function generateInterviewRepot({
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
      // responseJsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(response.text);
  const report = interviewReportSchema.parse(JSON.parse(response.text));
  console.dir(report, { depth: null });
  return report;
}

module.exports = generateInterviewRepot;
