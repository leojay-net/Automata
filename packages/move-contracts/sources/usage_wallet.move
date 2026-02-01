module automata::usage_wallet {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use automata::spend_policy;
    use automata::reputation;

    /// Error codes
    const EINSUFFICIENT_BALANCE: u64 = 1;
    const EUNAUTHORIZED: u64 = 2;
    const ENO_WALLET: u64 = 3;

    /// Wallet stores the balance for automata usage
    struct UsageWallet has key {
        balance: coin::Coin<AptosCoin>,
    }

    /// Create a usage wallet funded by the signer
    public entry fun create_wallet(account: &signer, amount: u64) {
        let coins = coin::withdraw<AptosCoin>(account, amount);
        if (exists<UsageWallet>(signer::address_of(account))) {
            let wallet = borrow_global_mut<UsageWallet>(signer::address_of(account));
            coin::merge(&mut wallet.balance, coins);
        } else {
            move_to(account, UsageWallet {
                balance: coins,
            });
        };
        // Also ensure policy registry exists
        spend_policy::initialize_registry(account);
    }

    /// Allow user to add funds
    public entry fun deposit(account: &signer, amount: u64) acquires UsageWallet {
        let coins = coin::withdraw<AptosCoin>(account, amount);
        let wallet = borrow_global_mut<UsageWallet>(signer::address_of(account));
        coin::merge(&mut wallet.balance, coins);
    }

    /// Allow owner to withdraw funds
    public entry fun withdraw(account: &signer, amount: u64) acquires UsageWallet {
        let wallet = borrow_global_mut<UsageWallet>(signer::address_of(account));
        let coins = coin::extract(&mut wallet.balance, amount);
        coin::deposit(signer::address_of(account), coins);
    }

    /// Authorize a spender (wrapper around spend_policy)
    public entry fun authorize_spender(account: &signer, spender: address, daily_limit: u64) {
        spend_policy::set_policy(account, spender, daily_limit);
    }

    /// Pay function called by an Agent (spender)
    public entry fun pay(
        spender: &signer,
        wallet_owner: address,
        provider: address,
        amount: u64
    ) acquires UsageWallet {
        let spender_addr = signer::address_of(spender);

        // 1. Check Policy and Update
        // This will abort if policy violated
        if (spender_addr != wallet_owner) {
             spend_policy::approve_spend(wallet_owner, spender_addr, amount);
        };

        // 2. Execute Payment
        assert!(exists<UsageWallet>(wallet_owner), ENO_WALLET);
        let wallet = borrow_global_mut<UsageWallet>(wallet_owner);
        
        // Check balance
        assert!(coin::value(&wallet.balance) >= amount, EINSUFFICIENT_BALANCE);
        
        let payment = coin::extract(&mut wallet.balance, amount);
        coin::deposit(provider, payment);

        // Update provider reputation on successful payment
        reputation::update_score(provider, true);
    }
}
