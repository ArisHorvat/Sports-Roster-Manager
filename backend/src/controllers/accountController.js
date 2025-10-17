const { Account, Team } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateToken(account) {
  const payload = {
    username: account.username,
    role: account.role,
    teamId: account.teamId,
  };

  // Sign the token
  const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
  return token;
}

const AccountController = {
    // **Create Account**
    async createAccount(req, res) {
        const { username, password, teamId } = req.body;
        if (!username || !password || !teamId) {
            return res.status(400).json({ error: 'Username, password, and teamId are required!' });
        }

        try {
            // Check if the username already exists
            const existingAccount = await Account.findOne({ where: { username } });
            if (existingAccount) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Check if the provided teamId exists
            const team = await Team.findByPk(teamId);
            if (!team) {
                return res.status(400).json({ error: 'Team not found' });
            }

            // Create new account
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAccount = await Account.create({
                username,
                password: hashedPassword,
                teamId,
            });
            res.status(201).json(newAccount);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // **Login Account**
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required!' });
        }

        try {
            // Find account by username
            const account = await Account.findOne({ where: { username } });

            if (!account) {
                return res.status(401).json({ error: 'No account found' });
            }

            const isMatch = await bcrypt.compare(password, account.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            const token = generateToken(account);

            // Successful login
            res.json(token);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // **Update Account**
    async updateAccount(req, res) {
        const { id } = req.params; // Use account ID for update
        const { newPassword, newTeamId } = req.body;

        try {
            const account = await Account.findByPk(id);

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            // Optionally validate the new teamId if provided
            if (newTeamId) {
                const team = await Team.findByPk(newTeamId);
                if (!team) {
                    return res.status(400).json({ error: 'Team not found' });
                }
            }

            // Update fields
            if (newPassword) {
                account.password = newPassword;
            }
            if (newTeamId) {
                account.teamId = newTeamId;
            }

            // Save the updated account
            await account.save();

            res.status(200).json(account);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // **Delete Account**
    async deleteAccount(req, res) {
        const { id } = req.params;

        try {
            const account = await Account.findByPk(id);

            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            // Delete the account
            await account.destroy();

            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = AccountController;