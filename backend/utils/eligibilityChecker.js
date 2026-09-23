/**
 * Eligibility Checker System
 * Compares Student Profile details against Job requirements.
 */

const checkEligibility = (studentProfile, job) => {
  if (!studentProfile || !job) {
    return {
      isEligible: false,
      reasons: ['Incomplete student profile or job data.']
    };
  }

  const reasons = [];

  // 1. CGPA check
  if (studentProfile.cgpa < job.minCGPA) {
    reasons.push(`Minimum CGPA required is ${job.minCGPA}, but your CGPA is ${studentProfile.cgpa.toFixed(1)}`);
  }

  // 2. Branch check
  if (job.allowedBranches && job.allowedBranches.length > 0) {
    const isBranchAllowed = job.allowedBranches.some(
      (b) => b.toUpperCase() === studentProfile.branch.toUpperCase()
    );
    if (!isBranchAllowed) {
      reasons.push(
        `Branch '${studentProfile.branch}' is not in allowed list (${job.allowedBranches.join(', ')})`
      );
    }
  }

  // 3. Passing Year check
  if (job.passingYear && studentProfile.passingYear !== job.passingYear) {
    reasons.push(
      `Required batch is ${job.passingYear}, your graduation year is ${studentProfile.passingYear}`
    );
  }

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    reasons
  };
};

module.exports = checkEligibility;
