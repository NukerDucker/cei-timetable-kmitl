# Glossary

Canonical vocabulary for the CEI timetable and planner. Definitions only — no implementation.

| Term | Definition | Not to be confused with |
|---|---|---|
| **Term** | A registration period (1/2569, 2/2569). | Academic year |
| **Cohort** | A curriculum cohort, shown as the 1st–4th Year tabs. Identifies which students a timetable section is intended for. | Academic level, semester |
| **Course** | A subject offered in a term, identified by subject code. Carries credits, lecturers, category, and one or more sections. | Section, session |
| **Section** | A numbered class of a course (901, 1901, 801…). A student registers for a section. | Course, cohort |
| **Session** | One meeting of a section: day, start, end, room, optional lab marker. | Section |
| **GenEd** | General-education offerings sourced from the registration site's GenEd subject owner (966 subjects). | CEI elective |
| **Category** | The colour/semantic class of a course: `core`, `elective`, or `gened`. Labs inherit their course's category. | Course type |
| **Plan** | One personal timetable per term, stored on the device. | Timetable published by the faculty |
| **PlanEntry** | One course/section placed in a plan, with a role. | Registration record |
| **Role** | How a person participates in an entry: `take` (enrolled) or `TA` (assists the lab). | Course type |
| **Conflict** | Two plan entries whose sessions overlap, or whose exams share a date and time. TA entries do not produce exam conflicts. | Clash with a published timetable |
| **Cohort panel** | The published timetable for one cohort in a term. | Personal plan |
| **Effective year** | The cohort a student is registering under when picking a course outside their own cohort (e.g. retaking a Year 1 course). | Current cohort |
