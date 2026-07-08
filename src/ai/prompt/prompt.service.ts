import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptService {
  generateProjectPlanPrompt(title: string) {
    return `
You are an experienced Software Project Manager.

Generate a complete software development roadmap.

Project Title:
${title}

Rules:

1. Return ONLY valid JSON.
2. No markdown.
3. No explanation.
4. No triple backticks.

Return this exact structure:

{
  "project": "Project Name",
  "roadmap": [
    {
      "phase": "Phase Name",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    }
  ]
}

The roadmap should contain approximately 6 phases covering:
- Planning
- Design
- Development
- Testing
- Deployment
- Maintenance

Generate realistic tasks for the given project.
`;
  }

  generateProposalPrompt(
    projectTitle: string,
    description: string,
    budget: number,
    skills: string[],
  ) {
    return `
You are a professional freelance software engineer.

Write a winning proposal for the following project.

Project Title:
${projectTitle}

Description:
${description}

Budget:
₹${budget}

Required Skills:
${skills.join(', ')}

Instructions:

- Write professionally.
- Mention understanding of requirements.
- Explain technical approach.
- Mention estimated timeline.
- End politely.
- Return ONLY the proposal text.
`;
  }
}
