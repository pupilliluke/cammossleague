package cammossleague;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootTest
@EntityScan(basePackages = "cammossleague.model")
@ComponentScan(basePackages = "cammossleague")
@Import(TestDataConfiguration.class)
class CammossleagueApplicationTests {

	@Test
	void contextLoads() {
	}

}
