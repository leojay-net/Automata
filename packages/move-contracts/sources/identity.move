module automata::identity {
    use std::signer;
    use std::string::String;

    struct AgentIdentity has key {
        name: String,
        url: String, // Metadata URL
        verified: bool,
    }

    public entry fun register_agent(account: &signer, name: String, url: String) acquires AgentIdentity {
        let addr = signer::address_of(account);
        if (exists<AgentIdentity>(addr)) {
             let identity = borrow_global_mut<AgentIdentity>(addr);
             identity.name = name;
             identity.url = url;
        } else {
             move_to(account, AgentIdentity {
                 name,
                 url,
                 verified: false,
             });
        }
    }
}
