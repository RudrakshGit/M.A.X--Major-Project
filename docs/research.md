# Evidence base

Every claim the report makes should come from this page. Verified 2026-08-29.
If you add a claim, add its source. If a number is a guess, say so.

## 1. The legal mandate — why this is not optional for colleges

**Supreme Court of India, 25 July 2025 — _Sukdeb Saha v. State of Andhra
Pradesh_.** The Court held mental health to be integral to the right to life
under Article 21 and issued binding pan-India directions:

- every educational institution shall adopt and implement a uniform mental
  health policy, drawing on the UMMEED guidelines, the MANODARPAN initiative
  and the National Suicide Prevention Strategy;
- institutions with **100 or more enrolled students** shall engage at least one
  qualified counsellor, psychologist or social worker;
- **smaller institutions shall establish formal referral linkages with external
  mental health professionals**;
- policies are reviewed annually and published on the institution's website.

**UGC Draft Guidelines on Uniform Policy on Mental Health & Well-Being for
HEIs (2026).** Proposes a Mental Health & Well-being Centre, a Monitoring
Committee for **early detection and timely management**, counsellor–student
ratios, peer-support systems and crisis-management mechanisms.

**UMMEED (NCERT / Ministry of Education, 2023).** Understand, Motivate, Manage,
Empathise, Empower, Develop. Its stated first-response posture is a calm
environment, attentive listening, and earning confidence **without judging**.

> **Design consequence.** The referral directory is core scope, not a nice-to-have:
> it is the digital form of the referral linkage the Court requires of exactly
> the small rural and semi-urban colleges named in our problem statement. The
> campus dashboard is the digital form of the UGC "early detection" committee.
> MAX's conversational stance is derived from UMMEED, not invented by us.

## 2. Prevalence — the size of the problem

**Cherian et al., 2025** — the largest Indian college study of its kind.
8,542 students across 30 universities in nine states, measured with PHQ-9 and
GAD-7:

| Finding | Value |
| --- | --- |
| Moderate-to-severe depression symptoms | 33.6% |
| Moderate-to-severe anxiety symptoms | 23.2% |
| Lifetime suicidal ideation | 18.8% |
| Past-year suicidal ideation | 12.4% |
| Lifetime suicide attempt | 6.7% |
| Of those with ideation, told someone | 38.1% — **friends most common** |

**NCRB.** Student suicide deaths rose from 13,892 in 2023 to 14,488 in 2024,
a 4.3% increase and the highest in a decade.

> **Two design consequences.** First, we use PHQ-9 and GAD-7 because the
> definitive Indian study of our exact population used them — our numbers stay
> comparable to the literature. Second, students disclose to *friends*, not
> counsellors. That is why MAX is built as a friend-shaped presence with a
> referral path behind it, and not as a clinician simulator.

## 3. Efficacy — does a digital intervention actually work

- 2025 systematic review and meta-analysis of digital mental health
  interventions for university students: significant, **medium-sized** benefits
  on both depressive and anxious symptom severity.
- 2025 review, 20 studies, 30,639 participants: Hedges' g 0.80–0.88.
- Review of 95 studies (2019–2024): over 80% of interventions were effective or
  partially effective on their primary outcome.
- Internet-delivered CBT shows effect sizes comparable to face-to-face therapy.
- **Therabot RCT (NEJM AI, 2025)** — 210 adults, first RCT of a fully
  generative AI therapy chatbot; benefits for depression, anxiety and eating
  disorder risk, with therapeutic alliance rated comparably to human
  therapists. Criticisms to acknowledge: waitlist control, no independent
  evaluation, and an alliance measure designed for human relationships.

Cite the criticism as well as the result. A viva panel rewards the student who
names the limitation before they do.

## 4. Safety — what goes wrong, and what regulators now require

- AI chatbots failed to give a safe response in roughly **20%** of
  suicide-related prompts, against about **7%** for human therapists.
- General and specialist models both perform **inconsistently** on simulated
  suicide-risk prompts.
- Chatbot relationships can reinforce or amplify delusions in users vulnerable
  to psychosis.
- Purpose-built guardrail classifiers do far better than raw models: a
  published mental-health guardrail reported sensitivity 0.990 and specificity
  0.992.
- **From August 2026 the EU AI Act requires users be told they are interacting
  with an AI.** New York requires detection of suicidal ideation plus recurring
  disclosure that the bot is not human. Washington HB 2225 (January 2027) bans
  manipulative patterns — excessive praise, feigned distress, encouraging
  isolation from family, fostering dependence.

> **Design consequence.** A separate classifier in front of the model, not
> prompt instructions inside it. Persistent AI disclosure. An explicit
> anti-dependence rule in the companion's design. See [`safety.md`](safety.md).

## 5. Delivery conditions — the phone and the network

- 5G coverage depth: 78% urban, 42% semi-urban, **under 5% rural**. Rural is 4G.
- Real-world speeds on crowded tier-2 towers dip to **3–6 Mbps**.
- Budget Androids — Redmi, Realme, older Samsung J-series — carry over **55%**
  of Indian web traffic.
- Data costs real money; users close slow pages rather than wait.

> **Design consequence.** The performance budget in [`performance.md`](performance.md)
> is a graded requirement traceable to the phrase "rural and semi-urban" in our
> problem statement — not developer preference.

## 6. Instrument licensing — what we may legally ship

| Instrument | Status | Decision |
| --- | --- | --- |
| PHQ-9 | Public domain, released by Pfizer 2010-07-21 | **Use** |
| GAD-7 | Public domain, same release | **Use** |
| Copenhagen Burnout Inventory | Free, open-access by design | **Use** |
| PSS-10 | Now distributed by Mapi Trust; licence agreement may apply | **Avoid** |
| Insomnia Severity Index | Copyright Morin; permission via Mapi Trust | **Do not use** |
| UCLA Loneliness Scale | Free for research, but unverified for our use | **Avoid for now** |

For sleep, academic stress and connection we ship **our own short check-ins**,
labelled in the UI as not validated instruments. Honest and legally clean beats
an unlicensed copy of a better questionnaire.

## Sources

Legal and policy: [SCC Online — UGC guidelines](https://www.scconline.com/blog/post/2026/01/17/ugc-guidelines-for-mental-health-in-higher-educational-institutions/) ·
[Supreme Court framework](https://sabrangindia.in/how-the-supreme-court-built-a-binding-legal-framework-to-protect-student-mental-heath/) ·
[15 SC guidelines](https://www.mhfaindia.com/news/supreme-court-guidelines-mental-health-education-india) ·
[UMMEED PDF](https://www.indianembassyusa.gov.in/UMMEED-Prevention%20_of_Suicide.pdf)

Prevalence: [Cherian et al., 2025 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11572450/) ·
[Sage version](https://journals.sagepub.com/doi/10.1177/02537176241244775) ·
[NCRB 2024 reporting](https://news.careers360.com/ncrb-report-2023-over-13800-student-suicide-deaths-highest-in-10-years-national-crime-records-bureau-maharashtra-up-tn/amp) ·
[Lancet Regional Health SEA](https://www.thelancet.com/journals/lansea/article/PIIS2772-3682(26)00107-1/fulltext)

Efficacy: [Madrid-Cagigal et al., 2025](https://onlinelibrary.wiley.com/doi/full/10.1111/eip.70017) ·
[Digital interventions review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12505953/) ·
[Therabot RCT, NEJM AI](https://ai.nejm.org/doi/full/10.1056/AIoa2400802) ·
[Dartmouth summary](https://home.dartmouth.edu/news/2025/03/first-therapy-chatbot-trial-yields-mental-health-benefits)

Safety: [IEEE Spectrum — guardrails](https://spectrum.ieee.org/mental-health-chatbot-guardrails) ·
[APA, Patients are bringing AI to therapy](https://www.apa.org/pubs/reports/chatbots-mental-health-2026) ·
[npj Digital Medicine — crisis guardrail](https://www.nature.com/articles/s41746-026-02579-5)

Instruments: [Pfizer public-domain release](https://www.pfizer.com/news/press-release/press-release-detail/pfizer_to_offer_free_public_access_to_mental_health_assessment_tools_to_improve_diagnosis_and_patient_care) ·
[CBI](https://emerge.ucsd.edu/r_2qfb6wi4uepyugd/) ·
[ISI via Mapi Trust](https://eprovide.mapi-trust.org/isi-insomnia-severity-index/)

Helplines: [Tele MANAS, MoHFW](https://telemanas.mohfw.gov.in/home) ·
[KIRAN launch, PIB](https://www.pib.gov.in/pressreleaseshare.aspx?prid=1652240&reg=48&lang=2)
