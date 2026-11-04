---
name: to-questionnaire
description: Creates a questionnaire for another person to supply facts or decisions the user cannot resolve alone. Use when the user wants to turn an open decision into a document someone else fills in.
---

Turn something the user can't answer alone into a **questionnaire**: a Markdown document they hand to one person to fill in async, or fill out together over a meeting.

**Grill the send, not the subject.** Interview the user only about the _send_, which they can always answer: who it goes to, and what they need back. The questions in the document then target the **gap** between what the recipient knows and what the user needs.

1. **Who is it going to?** Reuse the supplied recipient's role, expertise and relationship to the user; ask only for missing details that affect the questionnaire. Done when you know who the recipient is and what they know that the user doesn't.

2. **What do you need back?** Use the stated decisions or facts the user needs from this person, asking only about unresolved goals. Done when you have a concrete list of what the user must walk away able to do or decide.

3. **Write the questionnaire.** Draft questions aimed at the gap from steps 1–2, following the Document structure below. Write it to `to-questionnaire-<slug>.md` in the current directory, with the slug taken from the decision named in step 2 or from the invocation arguments. Check the path first: revise an existing file only when the request identifies it; otherwise pick an unused filename. Report the path. Then make one pass: every step-2 item covered, one idea per question, an answer stub under each, no template placeholders left, a deadline only if supplied. Correct failures once, reread those sections, report any gap. Done when the user confirms or edits the question headings you list.

## Document structure

Frame the document as a **discovery questionnaire**: the user lacks context, the recipient holds it. Order questions most-important-first, since async means you may only get one pass, and group them under `##` headings by theme once there are more than a handful. In 'How to answer', include a deadline only if the user supplied one, and label any rough effort as an estimate.

<questionnaire-template>

# <Questionnaire title>

**Purpose:** why this questionnaire exists and the decision riding on it.

**From:** <the user>, **To:** <the recipient>, **How your answers will be used:** <where they go>

## Context

One paragraph orienting the recipient: enough to answer well, not a page.

## How to answer

<Deadline and estimated effort, if any.> Partial answers and "I don't know" are useful: flag anything you're unsure of rather than skipping it.

## <Theme heading>

One `##` section per theme. Every question is one idea, never compound, with an answer stub directly beneath, and a one-line _why this matters_ only where the question could be misread or invite a throwaway answer.

<question-example>
### What load is the system expected to handle at launch?

_Why this matters: it decides whether we provision for burst traffic now or defer it._

>
</question-example>

## Anything else?

A closing catch-all: anything we didn't ask that we should know?

</questionnaire-template>
