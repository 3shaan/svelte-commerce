<script lang="ts">
	import { page } from "$app/state";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { useSidebar } from "$lib/components/ui/sidebar/index.js";
	import type {
		NavCollapsible,
		NavGroup as NavGroupProps,
		NavItem,
		NavLink,
	} from "$lib/type/sidebar.type";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	let { title, items }: NavGroupProps = $props();

	const sidebar = useSidebar();
	const href = $derived(`${page.url.pathname}${page.url.search}`);

	let collapsibleOpen = $state<Record<string, boolean>>({});

	function checkIsActive(currentHref: string, item: NavItem, mainNav = false) {
		return (
			currentHref === item.url ||
			currentHref.split("?")[0] === item.url ||
			!!item?.items?.filter((i) => i.url === currentHref).length ||
			(mainNav &&
				currentHref.split("/")[1] !== "" &&
				currentHref.split("/")[1] === item?.url?.split("/")[1])
		);
	}

	function getCollapsibleOpen(item: NavCollapsible) {
		const key = item.title;
		if (collapsibleOpen[key] === undefined) {
			return checkIsActive(href, item, true);
		}
		return collapsibleOpen[key];
	}
</script>

{#snippet NavBadge(badge: string)}
	<span class="bg-primary text-primary-foreground rounded-full px-1 py-0 text-xs">{badge}</span>
{/snippet}

<Sidebar.Group>
	<Sidebar.GroupLabel>{title}</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (`${item.title}-${item.url ?? "group"}`)}
			{#if !item.items}
				{@const linkItem = item as NavLink}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						isActive={checkIsActive(href, linkItem)}
						tooltipContent={linkItem.title}
					>
						{#snippet child({ props })}
							<a
								href={linkItem.url}
								onclick={() => sidebar.setOpenMobile(false)}
								{...props}
							>
								{#if linkItem.icon}
									<linkItem.icon />
								{/if}
								<span>{linkItem.title}</span>
								{#if linkItem.badge}
									{@render NavBadge(linkItem.badge)}
								{/if}
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{:else if sidebar.state === "collapsed" && !sidebar.isMobile}
				{@const collapsibleItem = item as NavCollapsible}
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									tooltipContent={collapsibleItem.title}
									isActive={checkIsActive(href, collapsibleItem)}
									{...props}
								>
									{#if collapsibleItem.icon}
										<collapsibleItem.icon />
									{/if}
									<span>{collapsibleItem.title}</span>
									{#if collapsibleItem.badge}
										{@render NavBadge(collapsibleItem.badge)}
									{/if}
									<ChevronRightIcon
										class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									/>
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content side="right" align="start" sideOffset={4}>
							<DropdownMenu.Label>
								{collapsibleItem.title}
								{collapsibleItem.badge ? `(${collapsibleItem.badge})` : ""}
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							{#each collapsibleItem.items as sub (`${sub.title}-${sub.url}`)}
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a
											href={sub.url}
											class={checkIsActive(href, sub) ? "bg-secondary" : ""}
											{...props}
										>
											{#if sub.icon}
												<sub.icon />
											{/if}
											<span class="max-w-52 text-wrap">{sub.title}</span>
											{#if sub.badge}
												<span class="ms-auto text-xs">{sub.badge}</span>
											{/if}
										</a>
									{/snippet}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			{:else}
				{@const collapsibleItem = item as NavCollapsible}
				<Collapsible.Root
					class="group/collapsible"
					open={getCollapsibleOpen(collapsibleItem)}
					onOpenChange={(open) => {
						collapsibleOpen[collapsibleItem.title] = open;
					}}
				>
					{#snippet child({ props })}
						<Sidebar.MenuItem {...props}>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton
										tooltipContent={collapsibleItem.title}
										{...props}
									>
										{#if collapsibleItem.icon}
											<collapsibleItem.icon />
										{/if}
										<span>{collapsibleItem.title}</span>
										{#if collapsibleItem.badge}
											{@render NavBadge(collapsibleItem.badge)}
										{/if}
										<ChevronRightIcon
											class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content class="CollapsibleContent">
								<Sidebar.MenuSub>
									{#each collapsibleItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton
												isActive={checkIsActive(href, subItem)}
											>
												{#snippet child({ props })}
													<a
														href={subItem.url}
														onclick={() => sidebar.setOpenMobile(false)}
														{...props}
													>
														{#if subItem.icon}
															<subItem.icon />
														{/if}
														<span>{subItem.title}</span>
														{#if subItem.badge}
															{@render NavBadge(subItem.badge)}
														{/if}
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						</Sidebar.MenuItem>
					{/snippet}
				</Collapsible.Root>
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
