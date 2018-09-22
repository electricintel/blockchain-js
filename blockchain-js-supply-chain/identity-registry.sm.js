({
    /**
     * identity registry
     * 
     * register user
     */
    init: function () {
        this.data.identities = {}
    },

    registerIdentity: function (args) {
        if (!lib.checkStringArgs(args, ['email', 'publicKey', 'comment']))
            return false

        let {
            email,
            publicKey,
            comment
        } = args

        if (email in this.data.identities) {
            console.warn(`already registered identity ${email}`)
            return false
        }

        this.data.identities[email] = {
            publicKey,
            comment
        }

        console.log(`registered identity ${email}`)
        return true
    },

    // not to be called on chain !
    signIn: function (args) {
        debugger;
        
        if (!lib.checkStringArgs(args, ['signedEmail']))
            return null

        let packedData = JSON.parse(args.signedEmail)

        let signedEmail = lib.extractPackedDataBody(packedData)
        if (!(signedEmail in this.data.identities)) {
            console.warn(`user not registered for signIn`)
            return null
        }

        let knownIdentity = this.data.identities[signedEmail]
        let publicKey = lib.extractPackedDataPublicKey(packedData)
        if (publicKey != knownIdentity.publicKey) {
            console.warn(`key invalid for signIn`)
            return null
        }

        if (!lib.verifyPackedData(packedData)) {
            console.warn(`signature invalid for signIn ${signedEmail}`)
            return null
        }

        console.log(`signIn successful for ${signedEmail}`)

        return signedEmail
    }
})