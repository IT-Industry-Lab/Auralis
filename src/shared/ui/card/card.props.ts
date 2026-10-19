import React from 'react';

export type AsProp<C extends React.ElementType> = {
  as?: C;
  asChild?: boolean;
};

export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {},
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

export type PolymorphicComponent<DefaultTag extends React.ElementType = 'div', Props = {}> = {
  <C extends React.ElementType = DefaultTag>(
    props: PolymorphicComponentPropWithRef<C, Props>
  ): React.ReactElement | null;
  displayName?: string;
};

export type CardProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropWithRef<C>;

export type CardHeaderProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropWithRef<C>;

export type CardBodyProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropWithRef<C>;

export type CardFooterProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropWithRef<C>;
