# states-read
Data and visualization about reading programs and assessments in US states

## Schema

* State
  - Two-letter code
  - Name
  - List of approved programs
  - List of approved assessments

* Program
  - Two-letter code
  - Name
  - Evidence
    * Evidence base: text
    * Cultural Responsiveness: text
    * Standards-Aligned: yes / no / partial
    * Feasible: yes / no / partial
    * Content focus: range of percentages (two numbers, 0 — 100)
    * Estimated Time: number in minutes
    * Time in Proposed Combinations: number in minutes
  - Percentage of time (numbers from 0 — 100)
    * reading
    * writing
    * discussion
  - ODL score: number 0 — 100
  - Free-form textual details

* Assessment:
  - Two-letter code
  - Name
  - Free-form textual details
