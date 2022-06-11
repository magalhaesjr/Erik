// Calculates the payouts for a division
export default function calcPayout(totalTeams, prizePool, payoutParams) {
  // Calculate the total prize pool
  const totalPrize = totalTeams * prizePool;
  // Cycle through each payout division and place
  const payout = {};
  Object.keys(payoutParams).forEach((div) => {
    payout[div] = {};
    Object.keys(payoutParams[div]).forEach((place) => {
      // Calculate payout for each defined place
      payout[div][place] =
        Math.ceil((totalPrize * payoutParams[div][place]) / 10) * 10;
    });
  });
  return payout;
}
