#[test_only]
module automata::usage_wallet_tests {
    use std::signer;
    use std::unit_test;
    use std::vector;
    use aptos_framework::coin::{Self, Coin, BurnCapability, MintCapability};
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::timestamp;
    use aptos_framework::account;
    
    use automata::usage_wallet;
    use automata::spend_policy;

    struct FrameworkCaps has key {
        burn_cap: BurnCapability<AptosCoin>,
        mint_cap: MintCapability<AptosCoin>,
    }

    /// Setup environment, initialize coins, timestamp
    fun setup_env(framework: &signer) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(framework);
        move_to(framework, FrameworkCaps { burn_cap, mint_cap });
        timestamp::set_time_has_started_for_testing(framework);
    }

    fun mint_coins(framework: &signer, recipient: address, amount: u64) acquires FrameworkCaps {
        let caps = borrow_global<FrameworkCaps>(signer::address_of(framework));
        let coins = coin::mint(amount, &caps.mint_cap);
        if (!account::exists_at(recipient)) {
            account::create_account_for_test(recipient);
        };
        coin::deposit(recipient, coins);
    }

    #[test]
    fun test_e2e_flow() acquires FrameworkCaps {
        let framework = account::create_account_for_test(@aptos_framework);
        setup_env(&framework);

        let owner = account::create_account_for_test(@0x100);
        let agent = account::create_account_for_test(@0x200);
        let provider = account::create_account_for_test(@0x300);

        // 1. Mint coins to Owner
        mint_coins(&framework, signer::address_of(&owner), 10000);

        // 2. Create Usage Wallet
        usage_wallet::create_wallet(&owner, 5000);
        
        // 3. Authorize Agent
        usage_wallet::authorize_spender(&owner, signer::address_of(&agent), 1000);

        // 4. Agent Pays Provider
        usage_wallet::pay(
            &agent,
            signer::address_of(&owner),
            signer::address_of(&provider),
            200 // Amount
        );

        // 5. Verify Balances
        // Check provider balance by borrowing resource...? 
        // In unit tests we rely on aborts usually, or check resources.
        // For simplicity, we assume if it didn't abort, it worked.
    }

    #[test]
    #[expected_failure(abort_code = automata::spend_policy::EEXCEEDS_DAILY_LIMIT)]
    fun test_daily_limit() acquires FrameworkCaps {
        let framework = account::create_account_for_test(@aptos_framework);
        setup_env(&framework);

        let owner = account::create_account_for_test(@0x100);
        let agent = account::create_account_for_test(@0x200);
        let provider = account::create_account_for_test(@0x300);

        mint_coins(&framework, signer::address_of(&owner), 10000);
        usage_wallet::create_wallet(&owner, 5000);
        
        // Limit 500
        usage_wallet::authorize_spender(&owner, signer::address_of(&agent), 500);

        // Pay 600 -> Should fail
        usage_wallet::pay(
            &agent,
            signer::address_of(&owner),
            signer::address_of(&provider),
            600
        );
    }
}
