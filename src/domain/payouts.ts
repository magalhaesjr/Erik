// Calculates the payouts for a division

type Finish = '1st' | '2nd' | '3rd' | '5th';
type PayoutBreakdown = {
  [key in Finish]?: number;
};

type PayoutDay = {
  main: PayoutBreakdown;
  sub?: PayoutBreakdown;
};

export type PrizePayout = {
  [key: string]: PayoutBreakdown;
};

type DivisionPayoutDefinition = {
  main: string;
  sub?: string;
};

type DayPayoutDefinition = DivisionPayoutDefinition[];
type TournamentPayoutDefinition = {
  saturday?: DayPayoutDefinition;
  sunday?: DayPayoutDefinition;
};

type TournamentPayout = {
  prizePool: number;
  saturday?: PayoutDay;
  sunday?: PayoutDay;
};

export type TournamentFinancials = {
  prepaidCost: number;
  walkOnCost: number;
  payoutDivisions: TournamentPayoutDefinition;
  payoutParams: TournamentPayout;
};

export const defaultPayout: TournamentFinancials = {
  prepaidCost: 80,
  walkOnCost: 90,
  payoutDivisions: {
    saturday: [
      { main: "Men's Open", sub: "Men's AA" },
      { main: "Women's Open", sub: "Women's AA" },
    ],
    sunday: [{ main: "Coed 2's Open", sub: "Coed 2's AA" }],
  },
  payoutParams: {
    prizePool: 45,
    saturday: {
      main: {
        '1st': 0.34,
        '2nd': 0.2,
        '3rd': 0.13,
      },
      sub: {
        '1st': 0.12,
        '2nd': 0.08,
      },
    },
    sunday: {
      main: {
        '1st': 0.34,
        '2nd': 0.2,
        '3rd': 0.13,
      },
    },
  },
};

/**
 * @brief Calculates the payout breakdown for a tournament day
 *
 * @param totalTeams is the total number of teams contributing to the pool
 * @param prizePool is the amount of money to allocate per team
 * @param payoutDay is the payout percentages for each finish
 * @returns payouts for each finish
 */
const calcPayout = (
  totalTeams: number,
  prizePool: number,
  payoutDay: PayoutDay
): PrizePayout => {
  // Calculate the total prize pool
  const totalPrize = totalTeams * prizePool;
  // Cycle through each payout division and place
  const prize: PrizePayout = { main: {}, sub: {} };

  // There is always a main payout
  Object.entries(payoutDay.main).forEach(([place, payout]) => {
    if (payout) {
      // Calculate payout for each defined place
      prize.main[place as Finish] = Math.ceil((totalPrize * payout) / 10) * 10;
    }
  });

  if (payoutDay.sub) {
    // There is always a main payout
    Object.entries(payoutDay.sub).forEach(([place, payout]) => {
      if (payout) {
        // Calculate payout for each defined place
        prize.sub[place as Finish] = Math.ceil((totalPrize * payout) / 10) * 10;
      }
    });
  }

  return prize;
};

export default calcPayout;
