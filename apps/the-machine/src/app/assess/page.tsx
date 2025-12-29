/**
 * The Machine - Risk Assessment Page
 * 
 * Interface for operators to evaluate threats and propose interventions.
 * Uses structured decision-making framework.
 */

'use client';

import { useState } from 'react';
import {
  createAssessment,
  calculateRiskScore,
  getRiskLevel,
  type ThreatIdentification,
  type HarmType,
  type TimeFrame,
  type RiskAssessment,
} from '@/lib/assessment';
import { formatCheckResult } from '@/lib/constraints';

export default function RiskAssessmentPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  
  // Form state
  const [whoAtRisk, setWhoAtRisk] = useState('');
  const [harmType, setHarmType] = useState<HarmType>('physical-violence');
  const [harmDescription, setHarmDescription] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('medium-term');
  const [location, setLocation] = useState('');
  const [perpetrator, setPerpetrator] = useState('');

  const handleIdentify = () => {
    const identification: ThreatIdentification = {
      whoAtRisk: whoAtRisk.split(',').map(s => s.trim()).filter(Boolean),
      harmType,
      harmDescription,
      timeFrame,
      location: location || undefined,
      perpetrator: perpetrator || undefined,
    };

    const newAssessment = createAssessment(identification, 'operator-001');
    setAssessment(newAssessment);
    setStep(2);
  };

  const handleReset = () => {
    setAssessment(null);
    setStep(1);
    setWhoAtRisk('');
    setHarmDescription('');
    setLocation('');
    setPerpetrator('');
  };

  return (
    <main className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Risk Assessment
              </h1>
              <p className="text-sm text-secondary-600">
                Structured threat evaluation framework
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to Console
            </a>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="border-b border-secondary-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Identify</span>
            </div>
            <div className="h-px flex-1 bg-secondary-200 mx-4" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Estimate</span>
            </div>
            <div className="h-px flex-1 bg-secondary-200 mx-4" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Propose</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {step === 1 && (
          <div className="rounded-lg border border-secondary-200 bg-white p-8">
            <h2 className="mb-6 text-xl font-semibold text-secondary-900">
              Step 1: Identify the Threat
            </h2>
            
            <div className="space-y-6">
              {/* Who is at risk */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Who is at risk? <span className="text-alert-500">*</span>
                </label>
                <input
                  type="text"
                  value={whoAtRisk}
                  onChange={(e) => setWhoAtRisk(e.target.value)}
                  placeholder="Person A, Person B (comma-separated)"
                  className="w-full rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <p className="mt-1 text-xs text-secondary-500">
                  Enter names or descriptions, separated by commas
                </p>
              </div>

              {/* Harm type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Type of harm <span className="text-alert-500">*</span>
                </label>
                <select
                  value={harmType}
                  onChange={(e) => setHarmType(e.target.value as HarmType)}
                  className="w-full rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="physical-violence">Physical Violence</option>
                  <option value="psychological-abuse">Psychological Abuse</option>
                  <option value="self-harm">Self-Harm</option>
                  <option value="exploitation">Exploitation</option>
                  <option value="neglect">Neglect</option>
                  <option value="environmental">Environmental Harm</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Harm description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Detailed description <span className="text-alert-500">*</span>
                </label>
                <textarea
                  value={harmDescription}
                  onChange={(e) => setHarmDescription(e.target.value)}
                  placeholder="Describe the potential harm in detail..."
                  rows={4}
                  className="w-full rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Timeframe */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  When might this occur? <span className="text-alert-500">*</span>
                </label>
                <select
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                  className="w-full rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="imminent">Imminent (&lt;24 hours)</option>
                  <option value="near-term">Near-term (1-7 days)</option>
                  <option value="medium-term">Medium-term (1-4 weeks)</option>
                  <option value="long-term">Long-term (&gt;1 month)</option>
                </select>
              </div>

              {/* Location (optional) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where might this occur?"
                  className="w-full rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Perpetrator (optional) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Perpetrator (optional)
                </label>
                <input
                  type="text"
                  value={perpetrator}
                  onChange={(e) => setPerpetrator(e.target.value)}
                  placeholder="Who might cause this harm?"
                  className="w-full rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleIdentify}
                disabled={!whoAtRisk || !harmDescription}
                className="w-full rounded-md bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed"
              >
                Continue to Estimation
              </button>
            </div>
          </div>
        )}

        {step === 2 && assessment && (
          <div className="space-y-6">
            {/* Threat estimate */}
            <div className="rounded-lg border border-secondary-200 bg-white p-8">
              <h2 className="mb-6 text-xl font-semibold text-secondary-900">
                Step 2: Threat Estimate
              </h2>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="mb-1 text-sm font-medium text-secondary-500">Probability</p>
                  <p className="text-lg font-semibold text-secondary-900 capitalize">
                    {assessment.estimate.probability.replace('-', ' ')}
                  </p>
                </div>
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="mb-1 text-sm font-medium text-secondary-500">Severity</p>
                  <p className="text-lg font-semibold text-secondary-900 capitalize">
                    {assessment.estimate.severity}
                  </p>
                </div>
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="mb-1 text-sm font-medium text-secondary-500">Confidence</p>
                  <p className="text-lg font-semibold text-secondary-900 capitalize">
                    {assessment.estimate.uncertainty.replace('-', ' ')}
                  </p>
                </div>
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="mb-1 text-sm font-medium text-secondary-500">Data Quality</p>
                  <p className="text-lg font-semibold text-secondary-900 capitalize">
                    {assessment.estimate.dataQuality}
                  </p>
                </div>
              </div>

              {/* Risk score */}
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-secondary-500">Risk Score</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-4 w-full rounded-full bg-secondary-200">
                      <div
                        className={`h-4 rounded-full ${
                          getRiskLevel(calculateRiskScore(assessment)) === 'critical'
                            ? 'bg-alert-500'
                            : getRiskLevel(calculateRiskScore(assessment)) === 'high'
                            ? 'bg-yellow-500'
                            : 'bg-primary-500'
                        }`}
                        style={{ width: `${calculateRiskScore(assessment)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-secondary-900">
                    {calculateRiskScore(assessment)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-secondary-600 capitalize">
                  Risk Level: {getRiskLevel(calculateRiskScore(assessment))}
                </p>
              </div>

              {/* Rationale */}
              <div className="rounded-lg bg-secondary-50 p-4">
                <p className="mb-2 text-sm font-medium text-secondary-700">Assessment Rationale</p>
                <p className="text-sm text-secondary-600">
                  {assessment.estimate.rationaleBrief}
                </p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="mt-6 w-full rounded-md bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
              >
                Continue to Options
              </button>
            </div>
          </div>
        )}

        {step === 3 && assessment && (
          <div className="space-y-6">
            {/* Flags */}
            {assessment.flags.length > 0 && (
              <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-yellow-900">
                  <span>⚠️</span> Assessment Flags
                </h3>
                <div className="space-y-2">
                  {assessment.flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-yellow-800">
                      <span className="mt-0.5">•</span>
                      <span>{flag.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intervention options */}
            <div className="rounded-lg border border-secondary-200 bg-white p-8">
              <h2 className="mb-6 text-xl font-semibold text-secondary-900">
                Step 3: Intervention Options
              </h2>

              <div className="space-y-4">
                {assessment.options.map((option) => (
                  <div
                    key={option.id}
                    className={`rounded-lg border-2 p-6 ${
                      option.violatesConstraints
                        ? 'border-alert-300 bg-alert-50'
                        : assessment.recommendation === option.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-secondary-200 bg-white'
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 capitalize">
                          {option.id.replace('-', ' ')}
                          {assessment.recommendation === option.id && (
                            <span className="ml-2 text-sm font-normal text-primary-600">
                              (Recommended)
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 text-sm text-secondary-600">
                          {option.description}
                        </p>
                      </div>
                      {option.violatesConstraints && (
                        <span className="rounded-full bg-alert-100 px-3 py-1 text-xs font-medium text-alert-700">
                          Constrained
                        </span>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Expected outcome */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-secondary-700">
                          Expected Outcome
                        </p>
                        <p className="text-sm text-secondary-600">
                          {option.expectedOutcome}
                        </p>
                      </div>

                      {/* Effectiveness */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-secondary-700">
                          Estimated Effectiveness
                        </p>
                        <p className="text-sm text-secondary-600 capitalize">
                          {option.estimatedEffectiveness.replace('-', ' ')}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-green-700">
                          Benefits
                        </p>
                        <ul className="space-y-1">
                          {option.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-secondary-600">
                              <span className="text-green-600">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Risks */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-alert-700">
                          Risks
                        </p>
                        <ul className="space-y-1">
                          {option.risks.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-secondary-600">
                              <span className="text-alert-600">⚠</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-secondary-200 pt-4">
                      <span className={`rounded-full px-3 py-1 text-xs ${
                        option.isReversible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {option.isReversible ? 'Reversible' : 'Irreversible'}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs ${
                        option.legalStatus === 'legal'
                          ? 'bg-green-100 text-green-700'
                          : option.legalStatus === 'grey-area'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-alert-100 text-alert-700'
                      }`}>
                        {option.legalStatus}
                      </span>
                      <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs text-secondary-700">
                        {option.collateralImpact} collateral
                      </span>
                      {option.requiresApproval && (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-700">
                          Requires approval
                        </span>
                      )}
                    </div>

                    {/* Constraint check details */}
                    {option.constraintCheck && !option.constraintCheck.passed && (
                      <div className="mt-4 rounded-md bg-alert-100 p-4">
                        <p className="text-sm font-medium text-alert-900 mb-2">
                          Constraint Violations:
                        </p>
                        <pre className="text-xs text-alert-700 whitespace-pre-wrap">
                          {formatCheckResult(option.constraintCheck)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-md border-2 border-secondary-300 px-6 py-3 font-medium text-secondary-700 hover:bg-secondary-50"
                >
                  New Assessment
                </button>
                <button
                  className="flex-1 rounded-md bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
                >
                  Save Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
