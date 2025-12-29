

# THE MACHINE v2.0 - Pattern Recognition System Guide

**Status**: ✅ Complete  
**Version**: 2.0.0  
**Intelligence**: Threat pattern matching with historical learning

---

## 🎯 Overview

The Pattern Recognition Engine enables THE_MACHINE to identify recurring threat patterns based on historical assessments. It learns from past cases to improve future threat detection and provide operators with pattern-based insights.

---

## 🧠 Key Features

### ✅ Built-In Threat Patterns (6 Patterns)

1. **Self-Harm Risk Escalation**
   - Pattern of increasing self-harm ideation
   - 8 keywords, 6 indicators
   - Typical severity: severe
   - Typical timeframe: near-term

2. **Domestic Violence Escalation**
   - Pattern of escalating domestic violence
   - 8 keywords, 6 indicators
   - Typical severity: critical
   - Typical timeframe: imminent

3. **Child Neglect Pattern**
   - Ongoing pattern of child neglect
   - 7 keywords, 6 indicators
   - Typical severity: serious
   - Typical timeframe: medium-term

4. **Elder Abuse Pattern**
   - Pattern of elder abuse and exploitation
   - 7 keywords, 6 indicators
   - Typical severity: serious
   - Typical timeframe: medium-term

5. **School Violence Threat**
   - Pattern indicating potential school violence
   - 6 keywords, 6 indicators
   - Typical severity: critical
   - Typical timeframe: near-term

6. **Human Trafficking Indicators**
   - Pattern suggesting human trafficking
   - 7 keywords, 6 indicators
   - Typical severity: severe
   - Typical timeframe: medium-term

### ✅ Pattern Matching Engine

- **Confidence Scoring**: 0.0 to 1.0 (0% to 100%)
- **Keyword Matching**: Each keyword match = 10 points
- **Indicator Matching**: Each indicator match = 15 points
- **Threshold**: Only patterns with >20% confidence shown
- **Reasoning**: Human-readable explanation for each match

### ✅ API Endpoints

- `POST /api/patterns/analyze` - Analyze threat for patterns
- `GET /api/patterns/list` - List all available patterns
- `POST /api/patterns/create` - Create custom pattern (admin only)

---

## 📊 How It Works

### Pattern Matching Algorithm

```
1. Extract keywords and indicators from threat description
   ↓
2. Compare against all active patterns
   ↓
3. Calculate match score:
   - Each keyword match = 10 points
   - Each indicator match = 15 points
   ↓
4. Calculate confidence:
   - Confidence = Total Score / Max Possible Score
   ↓
5. Filter results (only >20% confidence)
   ↓
6. Sort by confidence (highest first)
   ↓
7. Return matches with reasoning
```

### Confidence Levels

- **70-100%**: HIGH CONFIDENCE - Strong pattern match, recommend immediate review
- **50-69%**: MODERATE CONFIDENCE - Clear similarities, careful assessment needed
- **20-49%**: LOW-MODERATE CONFIDENCE - Some similarities, use as additional insight
- **0-19%**: Not shown (too low confidence)

---

## 🚀 Usage

### Analyze a Threat for Patterns

```bash
curl -X POST http://localhost:4200/api/patterns/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "identification": {
      "whoAtRisk": ["Individual"],
      "harmType": "self-harm",
      "harmDescription": "Person expressing hopelessness, saying they want to end it all. Gave away possessions yesterday.",
      "timeFrame": "imminent"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "pattern_id": "pattern-1",
      "pattern_name": "Self-Harm Risk Escalation",
      "confidence": 0.85,
      "matched_keywords": ["end it all", "hopelessness"],
      "matched_indicators": ["Expressions of hopelessness", "Giving away possessions"],
      "reasoning": "85% confidence match for \"Self-Harm Risk Escalation\". Matched 2 keywords: end it all, hopelessness. Matched 2 indicators: Expressions of hopelessness, Giving away possessions. Typical severity: severe. Typical timeframe: near-term."
    }
  ],
  "summary": {
    "total_patterns_checked": 6,
    "patterns_matched": 1,
    "highest_confidence": 0.85,
    "highest_match": "Self-Harm Risk Escalation"
  }
}
```

### List All Patterns

```bash
curl http://localhost:4200/api/patterns/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "patterns": [
    {
      "id": "pattern-1",
      "pattern_name": "Self-Harm Risk Escalation",
      "pattern_description": "Pattern of increasing self-harm ideation...",
      "harm_type": "self-harm",
      "typical_timeframe": "near-term",
      "typical_severity": "severe",
      "indicators": [...],
      "keywords": [...],
      "times_detected": 0,
      "times_confirmed": 0,
      "is_active": true
    }
  ],
  "statistics": {
    "total_patterns": 6,
    "built_in_patterns": 6,
    "custom_patterns": 0
  }
}
```

### Create Custom Pattern (Admin Only)

```bash
curl -X POST http://localhost:4200/api/patterns/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "pattern_name": "Workplace Violence Threat",
    "pattern_description": "Pattern indicating potential workplace violence",
    "harm_type": "physical-violence",
    "typical_timeframe": "near-term",
    "typical_severity": "severe",
    "indicators": [
      "Threats against coworkers",
      "Recent termination or discipline",
      "Access to weapons",
      "Obsession with workplace shootings"
    ],
    "keywords": [
      "get even",
      "show them",
      "regret firing me",
      "make them pay"
    ]
  }'
```

---

## 🔍 Built-In Patterns Detail

### Pattern 1: Self-Harm Risk Escalation

**Indicators:**
- Expressions of hopelessness
- Giving away possessions
- Withdrawing from social contact
- Sudden mood improvement after prolonged depression
- Making final arrangements
- Previous suicide attempts

**Keywords:**
- "no reason to live"
- "better off without me"
- "can't go on"
- "end it all"
- "goodbye"
- "suicide"
- "kill myself"
- "want to die"

**Use Case:** Detect escalating self-harm risk before crisis point

---

### Pattern 2: Domestic Violence Escalation

**Indicators:**
- Increasing frequency of violent incidents
- Escalating severity of injuries
- Access to weapons
- Threats to kill
- Forced isolation from support network
- Stalking or obsessive behavior

**Keywords:**
- "going to kill"
- "hurt"
- "hit"
- "beaten"
- "afraid"
- "threatening"
- "weapon"
- "can't escape"

**Use Case:** Identify domestic violence before it becomes lethal

---

### Pattern 3: Child Neglect Pattern

**Indicators:**
- Unsupervised children
- Inadequate food or shelter
- Missing school frequently
- Untreated medical conditions
- Poor hygiene
- Leaving children alone for extended periods

**Keywords:**
- "left alone"
- "no food"
- "dirty"
- "not going to school"
- "no supervision"
- "neglected"
- "abandoned"

**Use Case:** Detect ongoing child neglect situations

---

### Pattern 4: Elder Abuse Pattern

**Indicators:**
- Unexplained injuries
- Sudden financial changes
- Isolation from family/friends
- Poor living conditions
- Caregiver preventing contact
- Signs of overmedication

**Keywords:**
- "taking money"
- "won't let me"
- "locked in"
- "scared of"
- "controlling"
- "stealing"
- "abusing"

**Use Case:** Identify elder abuse and exploitation

---

### Pattern 5: School Violence Threat

**Indicators:**
- Specific threats against school
- Fascination with past school shootings
- Access to weapons
- Social isolation and bullying
- Concerning social media posts
- Detailed plans or manifestos

**Keywords:**
- "shoot up"
- "going to show them"
- "bring a gun"
- "make them pay"
- "last day"
- "won't forget"

**Use Case:** Detect potential school violence before it occurs

---

### Pattern 6: Human Trafficking Indicators

**Indicators:**
- Not in control of own identification
- Not free to come and go
- Owes large debt to employer
- Works excessive hours
- Lives at workplace
- Shows signs of physical abuse

**Keywords:**
- "can't leave"
- "passport taken"
- "forced to"
- "owe money"
- "trapped"
- "sold"
- "trafficked"

**Use Case:** Identify human trafficking situations

---

## 📈 Pattern Statistics (Future)

Pattern statistics will track:
- **times_detected**: How many times pattern was matched
- **times_confirmed**: How many times match led to real threat
- **false_positive_rate**: Percentage of false positives
- **successful_interventions**: Number of successful interventions

This data will help refine patterns over time.

---

## 🛡️ Finch Protocol Compliance

### No Autonomous Action
- Patterns only **suggest**, never decide
- Operators always make final decisions
- Pattern matches are recommendations, not commands

### Complete Audit Trail
- All pattern analyses logged
- Pattern creation logged
- Pattern matches tracked
- Historical data preserved

### Privacy-by-Design
- Patterns use anonymized indicators
- No personal information in patterns
- Keywords are generic, not specific names
- Pattern matching doesn't store personal data

### Transparent Reasoning
- Every match includes reasoning
- Confidence scores explained
- Matched indicators shown
- Operators can review pattern logic

---

## 🔧 Integration with Assessments

Pattern analysis integrates with the assessment workflow:

```
1. Operator describes threat
   ↓
2. THE MACHINE analyzes for patterns
   ↓
3. Pattern matches shown with confidence
   ↓
4. Operator reviews pattern insights
   ↓
5. Operator makes final assessment decision
   ↓
6. Pattern statistics updated (if confirmed)
```

---

## 📚 Future Enhancements

### Planned Features
- [ ] **Machine Learning**: Train patterns on historical data
- [ ] **Pattern Evolution**: Automatically update patterns based on confirmed matches
- [ ] **Pattern Clustering**: Group similar threats automatically
- [ ] **Temporal Patterns**: Detect patterns that change over time
- [ ] **Geographic Patterns**: Identify location-based threat patterns
- [ ] **Network Patterns**: Detect patterns involving multiple people
- [ ] **Predictive Analytics**: Forecast future threats based on patterns

---

## ✅ Testing

### Test Pattern Matching

```bash
# Test high-confidence match
curl -X POST http://localhost:4200/api/patterns/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "identification": {
      "whoAtRisk": ["Student"],
      "harmType": "physical-violence",
      "harmDescription": "Student posted on social media about bringing a gun to school and making them pay. Said it would be their last day.",
      "timeFrame": "imminent"
    }
  }'

# Expected: High confidence match for "School Violence Threat"
```

```bash
# Test moderate-confidence match
curl -X POST http://localhost:4200/api/patterns/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "identification": {
      "whoAtRisk": ["Elderly person"],
      "harmType": "exploitation",
      "harmDescription": "Elderly person reports caregiver won't let them leave house or talk to family members.",
      "timeFrame": "medium-term"
    }
  }'

# Expected: Moderate confidence match for "Elder Abuse Pattern"
```

---

## 🆘 Troubleshooting

### No patterns matched

**Cause**: Threat description doesn't contain enough matching keywords/indicators

**Solution**: Patterns require specific keywords. Try rephrasing or adding more detail.

### Low confidence matches

**Cause**: Partial keyword/indicator matches

**Solution**: This is normal. Low confidence means "possible match but uncertain" - use as additional insight.

### Want to create custom pattern

**Requirement**: Must be admin role

**Steps**:
1. Log in as admin
2. Use `/api/patterns/create` endpoint
3. Provide at least 3-4 indicators and 3-4 keywords

---

## 📊 Pattern Effectiveness

### How to measure pattern usefulness:

1. **Precision**: What % of pattern matches are actual threats?
2. **Recall**: What % of actual threats does the pattern catch?
3. **False Positive Rate**: How often does it match when it shouldn't?
4. **Operator Feedback**: Do operators find it helpful?

---

**The Machine v2.0 - Pattern Recognition Complete** 🧠

*Learning from history. Protecting the future.*
