# SportsOS Coach Data Quality Audit

> Generated: 2026-06-14 | Source: `data/coaches.ts`

## Scoring Rubric

| Criterion | Points | Description |
|---|---|---|
| Slug uniqueness & format | 10 | Unique across dataset, matches `{name-slug}-{sport}-{city}` pattern |
| Name present & non-empty | 5 | Non-null, non-empty string |
| Certifications present | 10 | Array with at least one certification entry |
| Experience years > 0 | 5 | Numeric value greater than zero |
| Sports coached present | 10 | Array with at least one sport |
| Location (city/state/country) | 10 | All three fields present and non-empty |
| Phone present | 10 | Non-null, non-empty string |
| Email present | 10 | Non-null, non-empty string |
| Bio present | 10 | Non-null, non-empty string with >20 chars |
| Achievements present | 10 | Array with at least one achievement |
| Verification status set | 5 | Non-null value present |
| Rating present | 5 | Average and count both present |
| **Total** | **100** | |

---

## Individual Coach Scores

| # | ID | Name | City | Sport | Score | Issues |
|---|---|---|---|---|---|---|
| 1 | co_001 | Rahul Dravid | Bengaluru | Cricket | 100 | — |
| 2 | co_002 | Anil Kumble | Bengaluru | Cricket | 100 | — |
| 3 | co_003 | Saina Nehwal | Hyderabad | Badminton | 100 | — |
| 4 | co_004 | Pankaj Advani | Bengaluru | Billiards | 100 | — |
| 5 | co_005 | Viren Raquib | Bengaluru | Athletics | 100 | — |
| 6 | co_006 | Sushil Kumar | Delhi | Wrestling | 100 | — |
| 7 | co_007 | Mary Kom | Rohtak | Boxing | 100 | — |
| 8 | co_008 | Arjun Jadhav | Pune | Table Tennis | 95 | verificationStatus: pending (-5) |
| 9 | co_009 | Ramesh Powar | Bengaluru | Cricket | 100 | — |
| 10 | co_010 | Venkatesh Prasad | Bengaluru | Cricket | 100 | — |
| 11 | co_011 | Arun Jagadeesan | Bengaluru | Cricket | 100 | — |
| 12 | co_012 | Sunil Chhetri | Bengaluru | Football | 100 | — |
| 13 | co_013 | Gurpreet Singh Sandhu | Bengaluru | Football | 100 | — |
| 14 | co_014 | Prakash Padukone | Bengaluru | Badminton | 100 | — |
| 15 | co_015 | Mahesh Bhupathi | Bengaluru | Tennis | 100 | — |
| 16 | co_016 | Akanksha Singh | Bengaluru | Basketball | 100 | — |
| 17 | co_017 | Nisha Millet | Bengaluru | Swimming | 100 | — |
| 18 | co_018 | Pullela Gopichand | Hyderabad | Badminton | 100 | — |
| 19 | co_019 | MSK Prasad | Hyderabad | Cricket | 100 | — |
| 20 | co_020 | Sania Mirza | Hyderabad | Tennis | 100 | — |
| 21 | co_021 | VVS Laxman | Hyderabad | Cricket | 100 | — |
| 22 | co_022 | Saina Nehwal | Hyderabad | Badminton | 100 | Duplicate name (co_003) |
| 23 | co_023 | Ravi Shastri | Chennai | Cricket | 100 | — |
| 24 | co_024 | Sachin Tendulkar | Mumbai | Cricket | 100 | — |
| 25 | co_025 | Sunil Gavaskar | Mumbai | Cricket | 100 | — |
| 26 | co_026 | Baichung Bhutia | Mumbai | Football | 100 | — |
| 27 | co_027 | Michael Phelps | Mumbai | Swimming | 100 | — |
| 28 | co_028 | Kapil Dev | Delhi | Cricket | 100 | — |
| 29 | co_029 | Sourav Ganguly | Delhi | Cricket | 100 | — |
| 30 | co_030 | Gagan Narang | Delhi | Shooting | 100 | — |
| 31 | co_031 | Dilip Vengsarkar | Pune | Cricket | 100 | — |
| 32 | co_032 | Rahul Dravid | Pune | Cricket | 100 | Duplicate name (co_001) |
| 33 | co_033 | Bhaichung Bhutia | Pune | Football | 100 | — |
| 34 | co_034 | Saina Nehwal | Pune | Badminton | 100 | Duplicate name (co_003) |
| 35 | co_035 | Virender Sehwag | Vijayawada | Cricket | 100 | — |
| 36 | co_036 | Sourav Ganguly | Vijayawada | Cricket | 100 | Duplicate name (co_029) |
| 37 | co_037 | Bhaichung Bhutia | Vijayawada | Football | 100 | Duplicate name (co_033) |
| 38 | co_038 | Saina Nehwal | Vijayawada | Badminton | 100 | Duplicate name (co_003) |
| 39 | co_039 | Mahesh Bhupathi | Vijayawada | Tennis | 100 | Duplicate name (co_015) |
| 40 | co_040 | Kapil Dev | Visakhapatnam | Cricket | 100 | Duplicate name (co_028) |
| 41 | co_041 | Mahesh Bhupathi | Visakhapatnam | Tennis | 100 | Duplicate name (co_015) |
| 42 | co_042 | Saina Nehwal | Visakhapatnam | Badminton | 100 | Duplicate name (co_003) |
| 43 | co_043 | Bhaichung Bhutia | Visakhapatnam | Football | 100 | Duplicate name (co_033) |
| 44 | co_044 | Nisha Millet | Visakhapatnam | Swimming | 100 | Duplicate name (co_017) |
| 45 | co_045 | Virdhawal Khade | Bengaluru | Swimming | 100 | — |
| 46 | co_046 | Amritpal Singh | Hyderabad | Basketball | 100 | — |
| 47 | co_047 | Leander Paes | Chennai | Tennis | 100 | — |
| 48 | co_048 | Rehan Poncha | Mumbai | Swimming | 100 | — |
| 49 | co_049 | Jwala Gutta | Delhi | Badminton | 100 | — |
| 50 | co_050 | Sandeep Sejwal | Pune | Swimming | 100 | — |
| 51 | co_051 | Krishna Prasad | Madanapalle | Cricket | 100 | — |
| 52 | co_052 | Priya Reddy | Madanapalle | Badminton | 100 | — |

---

## Overall Score

| Metric | Value |
|---|---|
| **Average Score** | **99.9 / 100** |
| Perfect Scores (100) | 51 |
| Scores < 100 | 1 (Arjun Jadhav: 95) |

---

## Issues Found

### 1. Pending Verification (1 coach)
| ID | Name | City | Sport |
|---|---|---|---|
| co_008 | Arjun Jadhav | Pune | Table Tennis |

**Impact:** 5-point deduction. verificationStatus is `pending` instead of `verified`.

### 2. Duplicate Coach Names (8 duplicates across 10 entries)
The same person appears to have multiple entries in different cities. This may be intentional (multi-location coaching) or a data quality issue.

| Name | Duplicate Count | Cities |
|---|---|---|
| Saina Nehwal | 5 | Hyderabad, Pune, Vijayawada, Visakhapatnam + 1 more |
| Bhaichung Bhutia | 4 | Mumbai, Pune, Vijayawada, Visakhapatnam |
| Mahesh Bhupathi | 3 | Bengaluru, Vijayawada, Visakhapatnam |
| Sourav Ganguly | 2 | Delhi, Vijayawada |
| Rahul Dravid | 2 | Bengaluru, Pune |
| Kapil Dev | 2 | Delhi, Visakhapatnam |
| Nisha Millet | 2 | Bengaluru, Visakhapatnam |

**Recommendation:** If these represent the same person coaching in multiple cities, consider whether multiple entries are needed. If so, add a `relatedCoachIds` field to link them.

### 3. No Missing Data
All 52 coaches have complete data across all 12 scored fields. No null/empty values found for any required field.

---

## Score Breakdown by Field

| Field | 100% Compliant | Notes |
|---|---|---|
| Slug format & uniqueness | 52/52 | All slugs unique, follow `{name}-{sport}-{city}` pattern |
| Name present | 52/52 | All non-empty |
| Certifications | 52/52 | All have at least 1 certification |
| Experience years > 0 | 52/52 | Range: 6–22 years |
| Sports coached | 52/52 | All have at least 1 sport |
| Location complete | 52/52 | All have city, state, country |
| Phone present | 52/52 | All have phone numbers |
| Email present | 52/52 | All have email addresses |
| Bio present | 52/52 | All have meaningful bios |
| Achievements present | 52/52 | All have 1–4 achievements |
| Verification status set | 51/52 | 1 pending (co_008) |
| Rating present | 52/52 | All have average + count |

---

## Recommendations

1. **Resolve pending verification** for Arjun Jadhav (co_008)
2. **Clarify duplicate names** — determine if multi-city entries represent the same person or different people
3. **Expand sport coverage** — add coaches for under-represented sports (Hockey, Kabaddi, Chess, etc.)
4. **Geographic expansion** — add coaches in Kolkata, Jaipur, Lucknow, Ahmedabad, and other major cities
