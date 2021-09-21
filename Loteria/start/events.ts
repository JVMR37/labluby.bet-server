import Event from '@ioc:Adonis/Core/Event'

Event.on('new:bet', 'Bet.onNewBet')
