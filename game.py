import random

print("===== ROCK PAPER SCISSORS GAME =====")

choices = ["rock", "paper", "scissors"]

player_score = 0
computer_score = 0

while True:

    print("\nChoose one:")
    print("rock")
    print("paper")
    print("scissors")

    player = input("Enter your choice: ").lower()

    if player not in choices:
        print("Invalid choice. Please choose rock, paper, or scissors.")
        continue

    computer = random.choice(choices)

    print("\nYou chose:", player)
    print("Computer chose:", computer)

    # Game logic
    if player == computer:
        print("Result: It's a tie!")

    elif player == "rock":
        if computer == "scissors":
            print("Result: You win!")
            player_score += 1
        else:
            print("Result: Computer wins!")
            computer_score += 1

    elif player == "paper":
        if computer == "rock":
            print("Result: You win!")
            player_score += 1
        else:
            print("Result: Computer wins!")
            computer_score += 1

    elif player == "scissors":
        if computer == "paper":
            print("Result: You win!")
            player_score += 1
        else:
            print("Result: Computer wins!")
            computer_score += 1

    print("\nScoreboard")
    print("Player:", player_score)
    print("Computer:", computer_score)

    play_again = input("\nDo you want to play again? (yes/no): ").lower()

    if play_again != "yes":
        print("\nFinal Score")
        print("Player:", player_score)
        print("Computer:", computer_score)
        print("Thanks for playing!")
        break