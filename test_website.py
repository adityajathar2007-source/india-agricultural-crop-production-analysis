import time
import json
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By

def run_tests():
    edge_options = Options()
    edge_options.add_argument("--headless=new")
    edge_options.add_argument("--disable-gpu")
    edge_options.add_argument("--no-sandbox")
    edge_options.add_argument("--disable-dev-shm-usage")
    edge_options.add_argument("--window-size=1400,1000")

    driver = webdriver.Edge(options=edge_options)
    print("Browser started successfully.")

    try:
        url = "http://localhost:3000/index.html"
        driver.get(url)
        print("Loaded URL:", url)
        time.sleep(3)

        # Check title
        print("Page Title:", driver.title)

        # Check navigation elements
        nav_links = driver.find_elements(By.CSS_SELECTOR, ".desktop-nav .nav-link")
        print(f"Found {len(nav_links)} desktop navigation links:")
        for link in nav_links:
            print(" -", link.text, "->", link.get_attribute("href"))

        # Check sections exist
        sections = ["home", "overview", "objectives", "methodology", "dashboard", "story", "insights", "workflow", "conclusion"]
        for sec in sections:
            elem = driver.find_elements(By.ID, sec)
            print(f"Section #{sec} found: {len(elem) > 0}")

        # Wait for Tableau embedding elements
        dashboard_viz = driver.find_element(By.ID, "tableauDashboardViz")
        story_viz = driver.find_element(By.ID, "tableauStoryViz")
        print("Dashboard Viz src:", dashboard_viz.get_attribute("src"))
        print("Story Viz src:", story_viz.get_attribute("src"))

        # Wait for Tableau to connect and render iframes
        print("Waiting 12 seconds for Tableau iframe embeds to load...")
        time.sleep(12)

        # Check if iframes exist inside tableau-viz or shadow-root
        iframes_inside = driver.execute_script("""
            const dashViz = document.getElementById('tableauDashboardViz');
            const storyViz = document.getElementById('tableauStoryViz');
            
            function checkViz(viz) {
                if (!viz) return { found: false };
                const root = viz.shadowRoot || viz;
                const iframe = root.querySelector('iframe');
                return {
                    found: true,
                    hasIframe: !!iframe,
                    iframeSrc: iframe ? iframe.src : null,
                    offsetWidth: viz.offsetWidth,
                    offsetHeight: viz.offsetHeight
                };
            }
            
            return {
                dashboard: checkViz(dashViz),
                story: checkViz(storyViz)
            };
        """)
        print("Tableau Viz Shadow DOM Inspection:", json.dumps(iframes_inside, indent=2))

        # Capture screenshot of Dashboard
        driver.execute_script("document.getElementById('dashboard').scrollIntoView({behavior: 'instant'});")
        time.sleep(2)
        driver.save_screenshot("screenshot_dashboard.png")
        print("Saved screenshot_dashboard.png")

        # Capture screenshot of Story
        driver.execute_script("document.getElementById('story').scrollIntoView({behavior: 'instant'});")
        time.sleep(2)
        driver.save_screenshot("screenshot_story.png")
        print("Saved screenshot_story.png")

        # Capture screenshot of Objectives & Methodology
        driver.execute_script("document.getElementById('objectives').scrollIntoView({behavior: 'instant'});")
        time.sleep(1)
        driver.save_screenshot("screenshot_objectives.png")
        print("Saved screenshot_objectives.png")

        # Capture screenshot of Insights & Workflow
        driver.execute_script("document.getElementById('insights').scrollIntoView({behavior: 'instant'});")
        time.sleep(1)
        driver.save_screenshot("screenshot_insights.png")
        print("Saved screenshot_insights.png")

        # Capture screenshot of Conclusion & Footer
        driver.execute_script("document.getElementById('conclusion').scrollIntoView({behavior: 'instant'});")
        time.sleep(1)
        driver.save_screenshot("screenshot_conclusion.png")
        print("Saved screenshot_conclusion.png")

        # Check for Horizontal Overflow in Desktop
        scroll_width = driver.execute_script("return document.documentElement.scrollWidth")
        client_width = driver.execute_script("return document.documentElement.clientWidth")
        print(f"Desktop overflow test: scrollWidth={scroll_width}, clientWidth={client_width}. Has overflow: {scroll_width > client_width}")

        # Test Mobile Viewport
        print("\nTesting Mobile Viewport (375x812)...")
        driver.set_window_size(375, 812)
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(1)
        driver.save_screenshot("screenshot_mobile_hero.png")
        print("Saved screenshot_mobile_hero.png")

        mobile_scroll_width = driver.execute_script("return document.documentElement.scrollWidth")
        mobile_client_width = driver.execute_script("return document.documentElement.clientWidth")
        print(f"Mobile overflow test: scrollWidth={mobile_scroll_width}, clientWidth={mobile_client_width}. Has overflow: {mobile_scroll_width > mobile_client_width}")

        # Test Mobile Hamburger Menu
        menu_btn = driver.find_element(By.ID, "mobileMenuBtn")
        menu_btn.click()
        time.sleep(1)
        driver.save_screenshot("screenshot_mobile_menu.png")
        print("Saved screenshot_mobile_menu.png")

    finally:
        driver.quit()
        print("Test run completed.")

if __name__ == "__main__":
    run_tests()
