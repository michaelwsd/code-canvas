import { IconButton, HoverCard, Portal, Text } from "@chakra-ui/react"
import { FaUserAlt } from "react-icons/fa"
import type { userCardType } from "@/utils/types"

export const UserCard = ({users, user}: userCardType) => {
    return (
        <IconButton
            aria-label="toggle whiteboard"
            variant="outline"
            size='sm'
            _hover={{
                bg: "gray.500",       // background color on hover
                color: "white",       // icon color on hover
                transform: "scale(1.1)", // slightly enlarge
                transition: "all 0.2s ease-in-out", // smooth transition
                }}
        >
            <HoverCard.Root size="sm" positioning={{ placement: "right" }}>
                <HoverCard.Trigger asChild >
                    <FaUserAlt />
                </HoverCard.Trigger>

                <Portal>
                    <HoverCard.Positioner>
                    <HoverCard.Content>
                        <Text fontWeight="bold" mb={2}>Connected Users ({users.length}):</Text>
                        {users && users.length > 0 ? (
                            users.map((u) => (
                            <Text key={u.username} fontSize="sm" color="white">
                                {user.userId === u.userId ? u.username + " (you)" : u.username}
                            </Text>
                            ))
                        ) : (
                            <Text fontSize="sm" color="gray.400">No users connected</Text>
                        )}
                    </HoverCard.Content>
                    </HoverCard.Positioner>
                </Portal>
                
            </HoverCard.Root>
        </IconButton>
    )
}