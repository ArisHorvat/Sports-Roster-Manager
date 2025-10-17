const { Team, Player } = require('../../models');

const TeamController = {
    async getAllTeams(req, res) {
        try {
            const teams = await Team.findAll({
                include: [{
                    model: Player
                }]
            });

            const teamDetails = teams.map(team => {
                    return {
                        id: team.id,
                        teamName: team.teamName,
                        image: team.getImage(),      
                        nickname: team.getNickname(),
                        players: team.Players,
                    };
                });
            
            res.json(teamDetails);
        }
        catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving teams' });
        }
    },

    async getTeamById(req, res) {
        const { id } = req.params;
        const { sortKey, sortDirection, page = 1, perPage = 10, ...filters } = req.query;
    
        try{
            const team = await Team.findByPk(parseInt(id), {
                include: [{
                    model: Player,
                }]
            });
            
            if (!team) {
                return res.status(404).json({ error: 'Team not found' });
            }
        
            let players = team.Players;

        
            // Apply filters
            Object.keys(filters).forEach(key => {
                // Check if the key contains '[value]' or '[condition]'
                if (key.includes('[value]')) {
                    // Extract the field name and condition
                    const fieldName = key.split('[value]')[0]; 
                    const condition = filters[`${fieldName}[condition]`];
                    const value = filters[key]; 

                    if (["age", "experience", "height", "weight"].includes(fieldName)) {
                        const numericValue = parseInt(value);
                        // If the parsed value is invalid (NaN), skip this filter
                        if (isNaN(numericValue)) {
                            return;
                        }
        
                        switch (condition) {
                            case "greater":
                                players = players.filter(player => player[fieldName] > numericValue);
                                break;
                            case "less":
                                players = players.filter(player => player[fieldName] < numericValue);
                                break;
                            case "equals":
                            default:
                                players = players.filter(player => player[fieldName] == numericValue);
                                break;
                        }
                    }
                }
                else{
                    if("position" == key){
                        if (filters[key] !== '' && filters[key] !== undefined) {
                            players = players.filter(player => player[key] === filters[key]);
                        }
                    }
                }
            });
            
            // Apply sorting
            if (sortKey) {
                players.sort((a, b) => {
                    const aValue = a[sortKey];
                    const bValue = b[sortKey];

                    if (["name", "position"].includes(sortKey)) {
                        return sortDirection === "descending"
                            ? bValue.localeCompare(aValue)
                            : aValue.localeCompare(bValue);
                    }

                    return sortDirection === 'descending' ? bValue - aValue : aValue - bValue;
                });
            }
        
            // Pagination: Calculate start and end indices
            const startIndex = (parseInt(page) - 1) * parseInt(perPage);
            const endIndex = startIndex + parseInt(perPage);


            // Paginate players
            const paginatedPlayers = players.slice(startIndex, endIndex);
            
            
            // Respond with the team data and paginated players
            res.json({
                ...team.toJSON(),
                image: team.getImage(),
                nickname: team.getNickname(),
                players: paginatedPlayers,
                totalPlayers: players.length, // Include the total count of players for the frontend to know how many pages exist
                currentPage: page,
                totalPages: Math.ceil(players.length / perPage), // Calculate total pages based on total players and perPage
            });
        }
        catch(error){
            res.status(500).json({ error: 'An error occurred while retrieving the team' });
        }
    },

    async createTeam(req, res) {
        const { teamName } = req.body;

        if (!teamName || teamName.trim() === '') {
            return res.status(400).json({ error: 'Team name is required' });
        }

        try {
            const newTeam = await Team.create({ teamName });
            res.status(201).json({
                id: newTeam.id,
                teamName: newTeam.teamName,
                image: newTeam.getImage(),
                nickname: newTeam.getNickname(),
                players: []
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the team' });
        }
    },

    async updateTeam(req, res) {
        const { id } = req.params;
        const { teamName } = req.body;

        if (!teamName || teamName.trim() === '') {
            return res.status(400).json({ error: 'Team name is required' });
        }

        try {
            const team = await Team.findByPk(id);
            if (!team) {
                return res.status(404).json({ error: 'Team not found' });
            }

            team.teamName = teamName;
            await team.save();

            res.status(200).json({
                id: team.id,
                teamName: team.teamName,
                image: team.getImage(),
                nickname: team.getNickname(),
                players: team.Players || []
            });
        } 
        catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the team' });
        }
    },

    async deleteTeam(req, res) {
        const { id } = req.params;

        try {
            const team = await Team.findByPk(id);
            if (!team) {
                return res.status(404).json({ error: 'Team not found' });
            }

            await Player.update({ teamId: null }, { where: { teamId: id } });

            await team.destroy();

            res.status(204).send();
        } 
        catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting the team' });
        }
    },
};

module.exports = TeamController;