const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Make a suggestion for Vidi')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Your suggestion for Vidi')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const suggestion = interaction.options.getString('suggestion');
            const user = interaction.user;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('New Suggestion')
                .setDescription(suggestion)
                .addFields(
                    { name: 'Suggested by', value: user.tag }
                )
                .setFooter({ text: 'Vidi Suggestions' })
                .setTimestamp();

            // Send to owner via DM
            const ownerId = process.env.OWNER_ID;
            if (!ownerId) {
                throw new Error('Owner ID not configured in environment variables');
            }

            try {
                const owner = await interaction.client.users.fetch(ownerId);
                await owner.send({ embeds: [embed] });
                await interaction.reply({
                    content: 'Thank you for your suggestion! It has been sent to our team.',
                    ephemeral: true
                });
            } catch (dmError) {
                console.error('Error sending DM:', dmError);
                await interaction.reply({
                    content: 'An error occurred while sending your suggestion. Please try again later.',
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error in suggest command:', error);
            await interaction.reply({ 
                content: 'An error occurred while processing your suggestion. Please try again later.',
                ephemeral: true 
            });
        }
    }
};
