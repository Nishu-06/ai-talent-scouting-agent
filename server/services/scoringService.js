function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function calculateSkillScore(requiredSkills, candidateSkills) {
  if (!requiredSkills.length) return 60;

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSkills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase()),
  );

  return {
    score: Math.round((matchedSkills.length / requiredSkills.length) * 100),
    matchedSkills,
    missingSkills: requiredSkills.filter(
      (skill) => !matchedSkills.some((matchedSkill) => matchedSkill.toLowerCase() === skill.toLowerCase()),
    ),
  };
}

export function calculateExperienceScore(requiredExperience, candidateExperience) {
  const { min, max } = requiredExperience;

  if (candidateExperience >= min && candidateExperience <= max) return 100;
  if (candidateExperience > max) return clamp(90 - (candidateExperience - max) * 5);

  return clamp(100 - (min - candidateExperience) * 18);
}

export function calculateMatchScore(requiredSkills, requiredExperience, candidate) {
  const skillResult = calculateSkillScore(requiredSkills, candidate.skills);
  const experienceScore = calculateExperienceScore(requiredExperience, candidate.experience);
  const matchScore = Math.round(skillResult.score * 0.7 + experienceScore * 0.3);

  return {
    matchScore,
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
    experienceScore,
  };
}

export function calculateInterestScore(candidate, conversation) {
  const opennessScore = candidate.status === "open" ? 95 : 45;
  const noticeScore = clamp(100 - Math.max(candidate.noticePeriodDays - 15, 0) * 1.2);
  const salaryScore = candidate.salaryExpectationLpa <= 30 ? 85 : candidate.salaryExpectationLpa <= 35 ? 70 : 55;

  const enthusiasmSignal = conversation
    .filter((message) => message.sender === "candidate")
    .map((message) => message.text.toLowerCase())
    .join(" ");

  const enthusiasmScore =
    /open|happy|excited|strong|growth|exploring/.test(enthusiasmSignal) ? 85 : 60;

  const interestScore = Math.round(
    opennessScore * 0.4 + noticeScore * 0.25 + salaryScore * 0.2 + enthusiasmScore * 0.15,
  );

  return clamp(interestScore);
}

function parseNumberFromText(text) {
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function parseSalaryValue(answer) {
  const lowerAnswer = answer.toLowerCase();
  const number = parseNumberFromText(lowerAnswer);

  if (number === null) return null;
  if (/\$|usd|annually|per year|year/i.test(answer)) {
    return number / 10000;
  }

  return number;
}

function parseNoticeDays(answer) {
  const lowerAnswer = answer.toLowerCase();
  const number = parseNumberFromText(lowerAnswer);

  if (number !== null) {
    if (/week/i.test(lowerAnswer)) return number * 7;
    if (/month/i.test(lowerAnswer)) return number * 30;
    return number;
  }

  if (/two weeks/i.test(lowerAnswer)) return 14;
  if (/three weeks/i.test(lowerAnswer)) return 21;
  if (/one month/i.test(lowerAnswer)) return 30;
  if (/two months/i.test(lowerAnswer)) return 60;

  return null;
}

export function calculateInterestScoreFromAnswers(answers = []) {
  const [opennessAnswer = "", salaryAnswer = "", noticeAnswer = ""] = answers;

  let interestScore = 0;

  if (/\b(yes|open|actively looking|exploring|interested|available)\b/i.test(opennessAnswer)) {
    interestScore += 40;
  } else if (/\b(maybe|consider|selective)\b/i.test(opennessAnswer)) {
    interestScore += 20;
  }

  const salaryNumber = parseSalaryValue(salaryAnswer);
  if (salaryNumber !== null) {
    if (salaryNumber <= 30) {
      interestScore += 30;
    } else if (salaryNumber <= 40) {
      interestScore += 15;
    }
  }

  const noticeNumber = parseNoticeDays(noticeAnswer);
  if (noticeNumber !== null) {
    if (noticeNumber <= 30) {
      interestScore += 30;
    } else if (noticeNumber <= 60) {
      interestScore += 15;
    }
  }

  return clamp(interestScore);
}

export function calculateFinalScore(matchScore, interestScore) {
  return Math.round(matchScore * 0.7 + interestScore * 0.3);
}

export function deriveCandidateTag(matchScore, interestScore) {
  if (!interestScore) {
    if (matchScore >= 85) return "Strong Match";
    if (matchScore >= 70) return "Promising Match";
    return "Needs Review";
  }

  if (matchScore >= 85 && interestScore >= 80) return "Perfect Fit";
  if (matchScore >= 80 && interestScore < 65) return "High Match, Low Interest";
  if (matchScore >= 70 && interestScore >= 70) return "Warm Prospect";
  if (matchScore < 65 && interestScore >= 80) return "Interested Upskill Candidate";
  return "Needs Review";
}
