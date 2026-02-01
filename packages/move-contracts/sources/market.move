module automata::market {
    use std::signer;
    use std::string::String;
    use std::vector;

    /// Error codes
    const EREGISTRY_NOT_INITIALIZED: u64 = 1;

    struct ServicePublicInfo has store, copy, drop {
        provider: address,
        name: String,
        base_price: u64,
        metadata_url: String,
    }

    /// Global registry stored at the module owner's address. 
    /// This acts as the single source of truth for discovery in the v1 protocol.
    struct GlobalRegistry has key {
        services: vector<ServicePublicInfo>,
    }

    /// Initialize the registry. Must be called by the module deployer (@automata).
    public entry fun initialize_registry(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<GlobalRegistry>(addr)) {
            move_to(account, GlobalRegistry {
                services: vector::empty(),
            });
        };
    }

    /// Publish a service to the global registry
    public entry fun publish_service(
         account: &signer,
         name: String,
         base_price: u64,
         metadata_url: String
    ) acquires GlobalRegistry {
         let provider_addr = signer::address_of(account);
         // We assume the registry is at @automata
         let registry_addr = @automata; 
         
         assert!(exists<GlobalRegistry>(registry_addr), EREGISTRY_NOT_INITIALIZED);
         let registry = borrow_global_mut<GlobalRegistry>(registry_addr);
         
         let info = ServicePublicInfo {
             provider: provider_addr,
             name,
             base_price,
             metadata_url,
         };
         vector::push_back(&mut registry.services, info);
    }
}
