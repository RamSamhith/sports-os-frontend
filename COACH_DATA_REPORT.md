# SportsOS Coach Data Report

> Generated: 2026-06-14 | Source: `data/coaches.ts`

## Summary

| Metric | Value |
|---|---|
| Total Coaches | 52 |
| Unique Coach Names | 44 |
| Cities Covered | 9 |
| Sports Covered | 12 |
| All Verified | 51 verified, 1 pending |
| Average Rating | 4.64 |
| Experience Range | 6–22 years |

---

## City Distribution

| City | State | Coaches | % of Total |
|---|---|---|---|
| Bengaluru | Karnataka | 14 | 26.9% |
| Hyderabad | Telangana | 7 | 13.5% |
| Pune | Maharashtra | 6 | 11.5% |
| Delhi | Delhi | 5 | 9.6% |
| Mumbai | Maharashtra | 5 | 9.6% |
| Visakhapatnam | Andhra Pradesh | 5 | 9.6% |
| Vijayawada | Andhra Pradesh | 4 | 7.7% |
| Chennai | Tamil Nadu | 2 | 3.8% |
| Madanapalle | Andhra Pradesh | 2 | 3.8% |
| **Total** | | **52** | **100%** |

**Top 3 Cities:** Bengaluru (14), Hyderabad (7), Pune (6) — account for 51.9% of all coaches.

---

## Sport Distribution

| Sport | Coaches | % of Total |
|---|---|---|
| Cricket | 16 | 30.8% |
| Badminton | 10 | 19.2% |
| Tennis | 6 | 11.5% |
| Football | 6 | 11.5% |
| Swimming | 6 | 11.5% |
| Basketball | 3 | 5.8% |
| Athletics | 1 | 1.9% |
| Billiards | 1 | 1.9% |
| Boxing | 1 | 1.9% |
| Table Tennis | 1 | 1.9% |
| Wrestling | 1 | 1.9% |
| Shooting | 1 | 1.9% |
| **Total** | **52** | **100%** |

**Dominant Sport:** Cricket accounts for 30.8% of all coaches.

---

## Coverage Analysis

### Geographic Coverage
- **9 cities** across **6 Indian states** + Delhi NCR
- **Bengaluru** is the most represented city (14 coaches, 26.9%)
- **South India** dominates: Bengaluru + Hyderabad + Chennai + Vijayawada + Visakhapatnam + Madanapalle = 34 coaches (65.4%)
- **West India**: Pune + Mumbai = 11 coaches (21.2%)
- **North India**: Delhi = 5 coaches (9.6%)

### Sport Coverage Gaps
- **Cricket** is heavily represented (16 coaches)
- **Under-represented sports** (1 coach each): Athletics, Billiards, Boxing, Table Tennis, Wrestling, Shooting
- **No coverage**: Hockey, Volleyball, Kabaddi, Chess, Gymnastics, Archery, Rowing, etc.

### Multi-City Sports
| Sport | Cities |
|---|---|
| Cricket | Bengaluru, Hyderabad, Chennai, Mumbai, Delhi, Pune, Vijayawada, Visakhapatnam, Madanapalle |
| Badminton | Bengaluru, Hyderabad, Pune, Vijayawada, Visakhapatnam, Delhi, Madanapalle |
| Football | Bengaluru, Mumbai, Pune, Vijayawada, Visakhapatnam |
| Tennis | Bengaluru, Hyderabad, Vijayawada, Visakhapatnam, Chennai |
| Swimming | Bengaluru, Mumbai, Pune, Visakhapatnam |
| Basketball | Bengaluru, Hyderabad |

---

## Verification Status

| Status | Count | % |
|---|---|---|
| Verified | 51 | 98.1% |
| Pending | 1 | 1.9% |

**Pending:** Arjun Jadhav (co_008) — Table Tennis, Pune

---

## Rating Distribution

| Rating Range | Count |
|---|---|
| 4.9 | 6 |
| 4.8 | 8 |
| 4.7 | 9 |
| 4.6 | 12 |
| 4.5 | 11 |
| 4.4 | 4 |
| 4.3 | 2 |

**Highest Rated (4.9):** Rahul Dravid, Anil Kumble, Prakash Padukone, Pullela Gopichand, Sachin Tendulkar, Kapil Dev, Michael Phelps

---

## Data Quality Notes

- All 52 coaches have complete required fields (slug, name, certifications, sports, location, contact, bio, achievements, rating)
- **Duplicate name entries** exist for: Saina Nehwal (5 entries across cities), Bhaichung Bhutia (4 entries), Rahul Dravid (2 entries), Kapil Dev (2 entries), Mahesh Bhupathi (3 entries), Sourav Ganguly (2 entries), Nisha Millet (2 entries)
- All slugs follow the `{name-slug}-{sport}-{city}` convention
- All locations include city, state, country, and lat/lng coordinates
- All coaches have phone and email contact information
