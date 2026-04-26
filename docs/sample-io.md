# Sample Input / Output

## Sample Job Description

```text
We are hiring a Senior Full Stack Engineer with strong experience in React, Node.js, MongoDB, AWS, and TypeScript. Candidates should have at least 4 years of experience and be open to remote collaboration across India time zones.
```

## Sample Parsed Output

```json
{
  "role": "Senior Full Stack Engineer",
  "skills": ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
  "experience": {
    "min": 4,
    "max": 8
  },
  "location": "Remote / India"
}
```

## Sample Ranked Output

```json
[
  {
    "name": "Aarav Mehta",
    "matchScore": 92,
    "interestScore": 84,
    "finalScore": 90,
    "tag": "Perfect Fit"
  },
  {
    "name": "Ishita Rao",
    "matchScore": 88,
    "interestScore": 67,
    "finalScore": 82,
    "tag": "High Match, Low Interest"
  }
]
```

