module automata::spend_policy {
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    
    /// Error codes
    const ENO_POLICY: u64 = 1;
    const EEXCEEDS_DAILY_LIMIT: u64 = 2;

    struct Policy has store, drop {
        max_daily_spend: u64,
        current_daily_spend: u64,
        last_reset_timestamp: u64,
    }

    struct PolicyRegistry has key {
        policies: Table<address, Policy>, // Spender -> Policy
    }

    /// Initialize the policy registry for an owner
    public fun initialize_registry(owner: &signer) {
        if (!exists<PolicyRegistry>(signer::address_of(owner))) {
            move_to(owner, PolicyRegistry {
                policies: table::new(),
            });
        };
    }

    /// Attach or update a policy for a specific spender agent
    public fun set_policy(owner: &signer, spender: address, max_daily: u64) acquires PolicyRegistry {
        let owner_addr = signer::address_of(owner);
        initialize_registry(owner); // Ensure exists
        
        let registry = borrow_global_mut<PolicyRegistry>(owner_addr);
        if (table::contains(&registry.policies, spender)) {
            let policy = table::borrow_mut(&mut registry.policies, spender);
            policy.max_daily_spend = max_daily;
        } else {
            table::add(&mut registry.policies, spender, Policy {
                max_daily_spend: max_daily,
                current_daily_spend: 0,
                last_reset_timestamp: timestamp::now_seconds(),
            });
        };
    }

    /// Check and update spend. Returns true if allowed. Aborts if not allowed.
    public fun approve_spend(owner_addr: address, spender_addr: address, amount: u64) acquires PolicyRegistry {
        assert!(exists<PolicyRegistry>(owner_addr), ENO_POLICY);
        let registry = borrow_global_mut<PolicyRegistry>(owner_addr);
        
        assert!(table::contains(&registry.policies, spender_addr), ENO_POLICY);
        let policy = table::borrow_mut(&mut registry.policies, spender_addr);

        let now = timestamp::now_seconds();
        // Reset if 24 hours (86400 seconds) have passed
        if (now > policy.last_reset_timestamp + 86400) {
            policy.current_daily_spend = 0;
            policy.last_reset_timestamp = now;
        };

        assert!(policy.current_daily_spend + amount <= policy.max_daily_spend, EEXCEEDS_DAILY_LIMIT);
        
        policy.current_daily_spend = policy.current_daily_spend + amount;
    }
}
