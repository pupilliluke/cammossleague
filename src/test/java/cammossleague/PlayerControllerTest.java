// package cammossleague;


// // import cammossleague.model.Player;
// import cammossleague.repository.PlayerRepository;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;

// import static org.hamcrest.Matchers.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @SpringBootTest
// @AutoConfigureMockMvc
// public class PlayerControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @Autowired
//     private PlayerRepository playerRepo;

//     @Test
//     public void testCreateAndGetPlayer() throws Exception {
//         // Clean slate
//         playerRepo.deleteAll();

//         // Create a player via POST
//         String playerJson = """
//             {
//               "firstName": "Stephen",
//               "lastName": "Curry",
//               "position": "PG"
//             }
//         """;

//         mockMvc.perform(post("/api/players")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(playerJson))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.firstName").value("Stephen"))
//                 .andExpect(jsonPath("$.id").exists());

//         // Fetch all players
//         mockMvc.perform(get("/api/players"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$", hasSize(1)))
//                 .andExpect(jsonPath("$[0].lastName").value("Curry"));
//     }
// }
