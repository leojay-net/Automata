module automata::reputation {
    use std::signer;
    
    // Allow usage_wallet to call this module to update scores upon payment
    friend automata::usage_wallet;

    struct ReputationScore has key {
        score: u64,
        total_transactions: u64,
    }

    /// Update reputation score. 
    /// Restricted to friend modules (usage_wallet) to ensure only valid payments trigger score updates.
    public(friend) fun update_score(agent_addr: address, success: bool) acquires ReputationScore {
        if (!exists<ReputationScore>(agent_addr)) {
            // If reputation doesn't exist, we skip update. 
            // Agents must initialize their reputation profile to build history.
            return
        };

        let rep = borrow_global_mut<ReputationScore>(agent_addr);
        rep.total_transactions = rep.total_transactions + 1;
        if (success) {
            rep.score = rep.score + 1;
        };
    }

    /// Initialize reputation for an account
    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<ReputationScore>(addr)) {
            move_to(account, ReputationScore {
                score: 100, // Start with base score
                total_transactions: 0
            });
        }
    }
}
