import React from "react";
import "../css/Sidenav.css";
import { Link } from "react-router-dom";
import { ListItemText, List, ListItem, ListItemIcon } from "@mui/material";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AttractionsIcon from "@mui/icons-material/Attractions";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import CategoryIcon from "@mui/icons-material/Category";
import TerminalIcon from "@mui/icons-material/Terminal";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SmartToyIcon from "@mui/icons-material/SmartToy";

function AgentUISidenav() {
  const ListItemTextStyle = {
    color: "var(--grey-color)",
  };

  return (
    <nav className="sidebar">
      <div className="menu_content">
        <List style={{ paddingTop: "50px" }}>
          <Link to="/app/Dashboard">
            <ListItem button id="menuDashboard">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <DashboardCustomizeIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>
              <ListItemText style={ListItemTextStyle} primary="DashBoard" />
            </ListItem>
          </Link>
          {/* Master section */}
          {/* master */}
          <div id="Master">
            <div>
              <Link to="/app/Category">
                <ListItem button className="">
                  <ListItemIcon>
                    <span className="navlink_icon2">
                      <i className="">
                        <span>
                          <CategoryIcon />
                        </span>
                      </i>
                    </span>
                  </ListItemIcon>

                  <ListItemText style={ListItemTextStyle} primary="Category" />
                </ListItem>
              </Link>
            </div>
          </div>
          <div id="Master">
            <div>
              <Link to="/app/Actions">
                <ListItem button className="">
                  <ListItemIcon>
                    <span className="navlink_icon2">
                      <i className="">
                        <span>
                          <AttractionsIcon />
                        </span>
                      </i>
                    </span>
                  </ListItemIcon>

                  <ListItemText style={ListItemTextStyle} primary="Actions" />
                </ListItem>
              </Link>
            </div>
          </div>
          <div id="Master">
            <div>
              <Link to="/app/CommandConfiguration">
                <ListItem button className="">
                  <ListItemIcon>
                    <span className="navlink_icon2">
                      <i className="">
                        <span>
                          <PermDataSettingIcon />
                        </span>
                      </i>
                    </span>
                  </ListItemIcon>

                  <ListItemText
                    style={ListItemTextStyle}
                    primary="Command Configuration"
                  />
                </ListItem>
              </Link>
            </div>
          </div>

          <div id="Master">
            <Link to="/app/commands-groups">
              <ListItem button className="">
                <ListItemIcon>
                  <span className="navlink_icon2">
                    <i className="">
                      <span>
                        <GroupWorkIcon />
                      </span>
                    </i>
                  </span>
                </ListItemIcon>

                <ListItemText
                  style={ListItemTextStyle}
                  primary="Group Commands Config"
                />
              </ListItem>
            </Link>
          </div>

          <Link to="/app/standalone-applications">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <TerminalIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Standalone Applications"
              />
            </ListItem>
          </Link>

          <Link to="/app/agent-updates">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <TerminalIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Agent Updates"
              />
            </ListItem>
          </Link>

          <Link to="/app/windowsInstalledSystems">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <TerminalIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Windows Installed Systems"
              />
            </ListItem>
          </Link>

          <Link to="/app/macInstalledSystems">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <TerminalIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="MAC Installed Systems"
              />
            </ListItem>
          </Link>

          <Link to="/app/unregisteredAssets">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <TerminalIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Unregistered Assets"
              />
            </ListItem>
          </Link>

  <Link to="/app/scriptRunner">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <SmartToyIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Script Runner"
              />
            </ListItem>
          </Link>

          <Link to="/app/scriptList">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <SmartToyIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Script List"
              />
            </ListItem>
          </Link>

            <Link to="/app/executionResult">
            <ListItem button className="">
              <ListItemIcon>
                <span className="navlink_icon2">
                  <i className="">
                    <span>
                      <PersonSearchIcon />
                    </span>
                  </i>
                </span>
              </ListItemIcon>

              <ListItemText
                style={ListItemTextStyle}
                primary="Execution Result"
              />
            </ListItem>
          </Link>
          
        </List>
      </div>
    </nav>
  );
}
export default AgentUISidenav;
