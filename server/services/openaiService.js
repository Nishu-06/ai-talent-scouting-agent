import OpenAI from "openai";
import { env } from "../config/env.js";

const knownSkills = [
  "React",
  "Node.js",
  "MongoDB",
  "AWS",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "PostgreSQL",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "Python",
  "FastAPI",
  "Azure",
  "Redis",
  "CI/CD",
  "Tailwind CSS",
];

const openai = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

function normalizeSkill(skill) {
  return skill.trim().replace(/\s+/g, " ");
}

function parseExperienceFromText(text) {
  const rangeMatch = text.match(/(\d+)\s*[-to]+\s*(\d+)\s+years?/i);
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
  }

  const minMatch = text.match(/(\d+)\+?\s+years?/i);
  if (minMatch) {
    const min = Number(minMatch[1]);
    return { min, max: min + 3 };
  }

  return { min: 2, max: 6 };
}

function inferRole(text) {
  const rolePatterns = [
    /hiring\s+(?:for\s+)?a[n]?\s+([^,.]+)/i,
    /looking for a[n]?\s+([^,.]+)/i,
    /role[:\-]\s*([^,.]+)/i,
    /(senior [^,.]+engineer)/i,
    /([^,.]+developer)/i,
  ];

  for (const pattern of rolePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1]
        .trim()
        .replace(/^the\s+/i, "")
        .replace(/\s+with\s+.+$/i, "")
        .replace(/\s+who\s+.+$/i, "");
    }
  }

  return "Software Engineer";
}

function inferLocation(text) {
  if (/remote/i.test(text) && /india/i.test(text)) return "Remote / India";
  if (/remote/i.test(text)) return "Remote";
  if (/hybrid/i.test(text)) return "Hybrid";
  if (/onsite|on-site/i.test(text)) return "On-site";
  return "Flexible";
}

export function fallbackParseJobDescription(jobDescription) {
  const extractedSkills = knownSkills.filter((skill) =>
    new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(jobDescription),
  ).map(normalizeSkill);

  return {
    role: inferRole(jobDescription),
    skills: extractedSkills,
    experience: parseExperienceFromText(jobDescription),
    location: inferLocation(jobDescription),
    source: "fallback",
  };
}

async function requestJsonResponse(messages, schema) {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }

  const response = await openai.responses.create({
    model: env.openAiModel,
    input: messages,
    temperature: 0.2,
    text: {
      format: {
        type: "json_schema",
        name: "structured_response",
        strict: true,
        schema,
      },
    },
  });

  return JSON.parse(response.output_text);
}

export async function parseJobDescription(jobDescription) {
  try {
    const parsed = await requestJsonResponse(
      [
        {
          role: "system",
          content:
            "Extract job requirements into JSON with keys: role, skills, experience { min, max }, location.",
        },
        {
          role: "user",
          content: jobDescription,
        },
      ],
      {
        type: "object",
        additionalProperties: false,
        required: ["role", "skills", "experience", "location"],
        properties: {
          role: { type: "string" },
          skills: {
            type: "array",
            items: { type: "string" },
          },
          experience: {
            type: "object",
            additionalProperties: false,
            required: ["min", "max"],
            properties: {
              min: { type: "number" },
              max: { type: "number" },
            },
          },
          location: { type: "string" },
        },
      },
    );

    const min = Number(parsed?.experience?.min ?? 2);
    const rawMax = Number(parsed?.experience?.max ?? min + 3);
    const max = rawMax >= min ? rawMax : min + 3;

    return {
      role: parsed.role || "Software Engineer",
      skills: Array.isArray(parsed.skills) ? parsed.skills.map(normalizeSkill) : [],
      experience: { min, max },
      location: parsed.location || "Flexible",
      source: "openai",
    };
  } catch (error) {
    return fallbackParseJobDescription(jobDescription);
  }
}

function fallbackCandidateReply(candidate, question) {
  if (/open to new opportunities/i.test(question)) {
    if (candidate.status === "open") {
      return "Yes, I am open to exploring the right opportunity if the role has strong ownership and growth.";
    }
    return "I am not actively looking right now, but I would consider something exceptional.";
  }

  if (/expected salary/i.test(question)) {
    return `I would be targeting around ${candidate.salaryExpectationLpa} LPA depending on scope and benefits.`;
  }

  if (/notice period/i.test(question)) {
    return `My current notice period is ${candidate.noticePeriodDays} days.`;
  }

  return "Happy to share more details if the role aligns with my background.";
}

function buildFallbackAnswers(candidate, questions) {
  return questions.map((question) => fallbackCandidateReply(candidate, question));
}

export async function generateCandidateAnswers(candidate, questions) {
  const fallbackAnswers = buildFallbackAnswers(candidate, questions);

  if (!openai) {
    return { answers: fallbackAnswers, source: "fallback" };
  }

  try {
    const result = await requestJsonResponse(
      [
        {
          role: "system",
          content:
            "You are a software engineer candidate. Answer recruiter questions realistically and professionally.",
        },
        {
          role: "user",
          content: `You are a software engineer candidate.

Candidate Details:
- Skills: ${candidate.skills.join(", ")}
- Experience: ${candidate.experience} years

Answer the following recruiter questions realistically and professionally:

1. ${questions[0]}
2. ${questions[1]}
3. ${questions[2]}

Return responses in JSON format:
{
  "answers": [
    "...",
    "...",
    "..."
  ]
}`,
        },
      ],
      {
        type: "object",
        additionalProperties: false,
        required: ["answers"],
        properties: {
          answers: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
        },
      },
    );

    const answers =
      Array.isArray(result.answers) && result.answers.length === questions.length
        ? result.answers
        : fallbackAnswers;

    return { answers, source: "openai" };
  } catch (error) {
    return { answers: fallbackAnswers, source: "fallback" };
  }
}
