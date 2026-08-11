import { Injectable } from '@nestjs/common';
import { GenerateProjectPlanDto } from '../dto/generate-project-plan.dto';

@Injectable()
export class PromptService {
  generateProjectPlanPrompt(fields: GenerateProjectPlanDto) {
    return `
You are an experienced Software Project Manager.

Generate a complete software development execution plan based on the following project details.

Project Title:
${fields.title}

Project Description:
${fields.description}

Category:
${fields.category || 'Not specified'}

Project Type:
${fields.projectType || 'Not specified'}

Budget:
${fields.budget ? '₹' + fields.budget : 'Not specified'}

Deadline:
${fields.deadline || 'Not specified'}

Required Skills:
${fields.requiredSkills || 'Not specified'}

Team Size:
${fields.teamSize || 'Not specified'}

Priority:
${fields.priority || 'Not specified'}

Rules:

1. Return ONLY valid JSON.
2. No markdown.
3. No explanation.
4. No triple backticks.

Return this exact structure:

{
  "summary": "Brief project summary based on the description and requirements.",
  "roadmap": [
    {
      "phase": "Phase Name",
      "duration": "X weeks/months",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ],
  "roles": [
    {
      "role": "Role Name",
      "responsibility": "What this role is responsible for in the project."
    }
  ],
  "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "timeline": "Estimated total duration (e.g., 3 months)",
  "riskAnalysis": [
    {
      "risk": "Possible risk description",
      "solution": "How to mitigate this risk"
    }
  ],
  "recommendations": ["AI Recommendation 1", "AI Recommendation 2", "AI Recommendation 3"]
}

The roadmap should contain approximately 6 phases covering:
- Planning
- Design
- Development
- Testing
- Deployment
- Maintenance

Base the estimates, roles, risks, and recommendations on the provided project details.
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
