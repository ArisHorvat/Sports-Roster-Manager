const { Player } = require('../../models');
const { logAction } = require('../../services/logger');

const PlayerController = {
    async getAllPlayers(req, res) {
        const { sortKey, sortDirection} = req.query;

        try{
            let players = await Player.findAll();
            
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
        
            
            // Respond with the team data and paginated players
            res.json({
                players,
                totalPlayers: players.length, // Include the total count of players for the frontend to know how many pages exist
            });
        }
        catch(error){
            res.status(500).json({ message: "Error fetching players", error: error.message });
        }
        
    },

    async getAllPlayersFromTeam(req, res) {
        const { teamId } = req.params;
        const { sortKey, sortDirection, page = 1, perPage = 10, filters } = req.query;

        let parsedFilters = {};
        if (filters) {
            try {
                parsedFilters = JSON.parse(filters);
            } catch (e) {
                return res.status(400).json({ message: "Invalid filters JSON format" });
            }
        }
        

        const numericFields = ['age', 'experience', 'height', 'weight'];
        const validConditions = ['equals', 'greater', 'less'];
        const errors = {};
        // Validate each numeric filter
        try{
            for (const field of numericFields) {
                const filter = parsedFilters[field];
                if (filter) {
                    if (!validConditions.includes(filter.condition)) {
                        errors[field] = `Invalid condition '${filter.condition}'. Must be one of ${validConditions.join(', ')}`;
                    }
                    if (filter.value != '' && isNaN(parseFloat(filter.value))) {
                        errors[field] = `${field} value must be a number`;
                    }
                }
            }
        }
        catch(e){
            return res.status(400).json({ error: "Invalid filters" });
        }

        for (const key in parsedFilters) {
            if (!numericFields.includes(key) && key !== 'position') {
                return res.status(400).json({ message: "Invalid filters" });
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Invalid filter parameters",
                errors
            });
        }

        try{
            let filteredPlayers = await Player.findAll({ 
                where: {teamId: teamId},     
                order: [[sortKey !== '' ? sortKey : 'id', sortDirection === 'descending' ? 'DESC' : 'ASC']]
            })

            // Apply Filtering
            const applyCondition = (value, cond, actual) => {
                value = parseFloat(value);
                actual = parseFloat(actual);
                switch (cond) {
                    case 'equals': return actual === value;
                    case 'greater': return actual > value;
                    case 'less': return actual < value;
                    default: return true;
                }
            };
        
            if (parsedFilters.age.value) 
                filteredPlayers = filteredPlayers.filter(p => applyCondition(parsedFilters.age.value, parsedFilters.age.condition, p.age));
            
            if (parsedFilters.experience.value) 
                filteredPlayers = filteredPlayers.filter(p => applyCondition(parsedFilters.experience.value, parsedFilters.experience.condition, p.experience));
            
            if (parsedFilters.height.value) 
                filteredPlayers = filteredPlayers.filter(p => applyCondition(parsedFilters.height.value, parsedFilters.height.condition, p.height));
            
            if (parsedFilters.weight.value) 
                filteredPlayers = filteredPlayers.filter(p => applyCondition(parsedFilters.weight.value, parsedFilters.weight.condition, p.weight));
            
            if (parsedFilters.position) 
                filteredPlayers = filteredPlayers.filter(p => parsedFilters.position === p.position);
            
            
            // Pagination: Calculate start and end indices
            const startIndex = (parseInt(page) - 1) * parseInt(perPage);
            const endIndex = startIndex + parseInt(perPage);

            // Paginate players
            const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);
            
            // Respond with the team data and paginated players
            res.status(200).json({
                players: paginatedPlayers,
                totalPlayers: filteredPlayers.length, // Include the total count of players for the frontend to know how many pages exist
                currentPage: page,
                totalPages: Math.ceil(filteredPlayers.length / perPage), // Calculate total pages based on total players and perPage
            });
        }
        catch(error){
            res.status(500).json({ message: "Error fetching players for team", error: error.message });
        }
    },

    async getPlayerById(req, res) {
        const playerId  = parseInt(req.params.id);

        if (isNaN(playerId)) {
            return res.status(400).json({ error: "Invalid player ID" });
        }

        const player = await Player.findByPk(playerId);  // Use class instance

        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        return res.json(player);
    },

    async createPlayer(req, res) {
        const { name, number, position, age, experience, height, weight, teamId } = req.body;
        logAction(req.user.username, 'CREATE_PLAYER');

        const errors = {};

        if (!name?.trim()) errors.name = "Name is required";
        if (number === undefined || isNaN(number) || number < 0 || number > 99)
            errors.number = "Number must be between 0 and 99";
        if (age === undefined || isNaN(age) || age < 18)
            errors.age = "Age must be at least 18";
        if (experience === undefined || isNaN(experience) || experience < 0)
            errors.experience = "Experience must be a non-negative number";
        if (height === undefined || isNaN(height) || height < 100)
            errors.height = "Height must be at least 100 cm";
        if (weight === undefined || isNaN(weight) || weight < 40)
            errors.weight = "Weight must be at least 40 kg";
        if (!position?.trim()) errors.position = "Position is required";


        // If any errors, send back with 400
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        try {
            console.log(req.body);
            const newPlayer = await Player.create({
                name: name, 
                number: number, 
                position: position, 
                age: age, 
                experience: experience, 
                height: height, 
                weight: weight, 
                teamId: teamId,
            });
            console.log("hello")
            res.status(201).json(newPlayer);
        } 
        catch (error) {
            console.error("Create Player Error:", error); // Add this for full error output
            res.status(500).json({ message: error.message });
        }
    },

    async updatePlayer(req, res) {
        const { id } = req.params;
        const { name, number, position, age, experience, height, weight, teamId } = req.body;
        logAction(req.user.username, 'UPDATE_PLAYER');

        const errors = {};
    
        // Validate fields and add errors to the errors object
        if (name && !name.trim()) errors.name = "Name is required";
        if (number !== undefined && (isNaN(number) || number < 0 || number > 99))
            errors.number = "Number must be between 0 and 99";
        if (age !== undefined && (isNaN(age) || age < 18))
            errors.age = "Age must be at least 18";
        if (experience !== undefined && (isNaN(experience) || experience < 0))
            errors.experience = "Experience must be a non-negative number";
        if (height !== undefined && (isNaN(height) || height < 100))
            errors.height = "Height must be at least 100 cm";
        if (weight !== undefined && (isNaN(weight) || weight < 40))
            errors.weight = "Weight must be at least 40 kg";
        if (position && !position.trim()) errors.position = "Position is required";
    
        // If there are any validation errors, return them with a 400 status
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }
    
        // If no validation errors, update the player
        try {
            const player = await Player.findByPk(id);

            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }


            player.name = name ?? player.name;
            player.number = number ?? player.number;
            player.position = position ?? player.position;
            player.age = age ?? player.age;
            player.experience = experience ?? player.experience;
            player.height = height ?? player.height;
            player.weight = weight ?? player.weight;
            player.teamId = teamId ?? player.teamId;

            await player.save()
            res.status(200).json(player);
        } 
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deletePlayer(req, res) {
        const { id } = req.params;
        logAction(req.user.username, 'DELETE_PLAYER');

        try {
            const deletedCount = await Player.destroy({
                where: { id: id }
            });

            if (deletedCount === 0) {
                return res.status(404).json({ error: 'Player not found' });
            }

            res.status(200).json({ message: 'Player deleted successfully' });
        } 
        catch (error) {
            res.status(500).json({ message: "Error deleting player", error: error.message });
        }
    }
};

module.exports = PlayerController;